const form_company = document.getElementById('form_company')
var storage = firebase.storage();
var storageRef = storage.ref();
const db = firebase.firestore()


form_company && form_company.addEventListener('submit', (e) => {
	const email_company = document.getElementById('email_company');
	const password_company = document.getElementById('password_company');
	company_signup(email_company.value, password_company.value)
	e.preventDefault()

})

const company_signup = (email, password) => {
	const username_company = document.getElementById('username_company');
	const email_company = document.getElementById('email_company');
	const password_company = document.getElementById('password_company');
	const confirmpassword_company = document.getElementById('confirmpassword_company');
	const phone_company = document.getElementById('phone_company');
	const companyname_company = document.getElementById('companyname_company');
	const website_company = document.getElementById('website_company');
	const profilephoto_company = document.getElementById('profilephoto_company');
	const addressline_company = document.getElementById('addressline_company');

	function readURL1(input) {
		if (input.files && input.files[0]) {
			return input.files[0]
		}
	}

	async function sendMail(data, person) {
		if (person === "user") {
			fetch("https://ujvaljobs-backend-dk.vercel.app/user-registration", { method: "POST", body: JSON.stringify(data) });
		}else{
			fetch("https://ujvaljobs-backend-dk.vercel.app/company-registration", { method: "POST", body: JSON.stringify(data) });
		}
	}

	firebase.auth().createUserWithEmailAndPassword(email, password)
		.then((userCredential) => {
			// Signed in 
			var user = userCredential.user;
			var uploadTask = storageRef.child(`COMPANY/${user.uid}/${user.uid}.jpg`).put(readURL1(profilephoto_company));
			uploadTask.on('state_changed',
				(snapshot) => {
					var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
					switch (snapshot.state) {
						case firebase.storage.TaskState.PAUSED: // or 'paused'
							('Upload is paused');
							break;
						case firebase.storage.TaskState.RUNNING: // or 'running'
							('Upload is running');
							break;
					}
				},
				(error) => {
					// Handle unsuccessful uploads
				},
				() => {
					const user = firebase.auth().currentUser;
					user.updateProfile({
						displayName: "COMPANY",
					}).then(() => {
						("Profile Updated")
					}).catch((error) => {
					});
					uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
						profileURL = downloadURL;
						db.collection("COMPANY").doc(user.uid).set({
							username: username_company.value,
							email: email_company.value,
							phonenumber: phone_company.value,
							company: companyname_company.value,
							website: website_company.value,
							addressline: addressline_company.value,
							photoURL: profileURL,
							disabled: false
						})
							.then(() => {
								sendMail({ email: user.email }, 'company')
								let localStorageData = JSON.parse(window.localStorage.getItem('ApplicationForSubscriptionCompany'))
								if (!localStorageData) {
									window.location.href = "../pricing/?update=true"
								} else {
									let amount = localStorageData.amount
									let plan = localStorageData.plan
									let days = localStorageData.days
									generateOrder(amount, plan, days, user)
									// db.collection("COMPANY").doc(user.uid)
									// 	.onSnapshot((doc) => {
									// 		let obj = doc.data()
									// 		obj.uid = doc.id
									// 		window.sessionStorage.setItem('user', JSON.stringify(obj))
									// 	});
									// // setTimeout(() => {
									// // 	window.location.href = "../pricing/"
									// // }, 1000);
									// try {
									// 	document.getElementById("sidebarName").innerHTML = user.company
									// 	document.getElementById("sidebarProfile").src = user.photoURL
									// } catch (error) {
									// }
								}
							})
							.catch((error) => {
								console.error("Error writing document: ", error);
							});

					});
				}
			);
			// ...
		})
		.catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			window.alert(errorMessage)
		});
}



const generateOrder = async (amount, plan, days, user) => {
	console.log("asdasd")
	// https://ujvaljobs-backend-dk.vercel.app/order?amount=${amount * 100}&currency=INR
	await fetch(`https://ujvaljobs-backend-dk.vercel.app/order?amount=${amount * 100}&currency=INR`, {
		method: 'POST',
	})
		.then(x => x.json())
		.then((data) => {
			console.log("flag1")
			const db = firebase.firestore()
			if (!user) {
				window.location.href = "../login/"
			}
			var docRef = db.collection("COMPANY").doc(user && user.uid);
			docRef.get().then((doc) => {
				if (doc.exists) {
					if (!doc.data().isSubscribed) {
						console.log("flag12")
						var options = {
							"key": "rzp_live_KvV5bL42EhSq9s", // Enter the Key ID generated from the Dashboard
							"amount": amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
							"currency": "INR",
							"name": "Ujval Jobs",
							"description": `Amount for ${plan} Plan`,
							"image": "https://ujvaljob.com/images/header/logo.png",
							"order_id": data.id,
							"handler": function (response) {
								successFunc(response, plan, days)
							},
							"prefill": {
								"name": user.company,
								"email": user.email,
								"contact": user.phonenumber
							},
							"theme": {
								"color": "#3399cc"
							}
						}
						var rzp1 = new Razorpay(options);
						rzp1.open();
						rzp1.on('payment.failed', function (response) {
							alert(response.error.description);
						});
					} else {
						alert('You have already subscribed')
					}
				} else {
					// doc.data() will be undefined in this case
				}
			}).catch((error) => {
			});
		});
}


const successFunc = (data, plan, days) => {
	data.subscription = plan
	data.isSubscribed = true
	data.validtill = getValidTillTimestamp(days)
	const db = firebase.firestore()
	var docRef = db.collection("COMPANY").doc(firebase.auth().currentUser.uid);
	window.localStorage.removeItem('ApplicationForSubscriptionCompany');
	docRef.update(data)
		.then(() => {
			alert("Document successfully updated!");
			window.location.href = "../"
		})
		.catch((error) => {
			// The document probably doesn't exist.
			console.error("Error updating document: ", error);
		});

}

const getValidTillTimestamp = (days) => {
	const dateObj = new Date()
	let newDateObj = new Date()
	let newDate = newDateObj.setDate(dateObj.getDate() + days)
	return newDate;
}