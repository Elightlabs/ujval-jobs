var storage = firebase.storage();
var storageRef = storage.ref();
const db = firebase.firestore()


// const personal_form = document.getElementById("personal_form");
const form_company = document.getElementById("form_company");
const register_btn = document.getElementById("register_btn");

// personal_form && personal_form.addEventListener('submit', (e) => {
// 	const email_personal = document.getElementById("email_personal");
// 	const password_personal = document.getElementById("password_personal");
// 	signUp(email_personal.value, password_personal.value)
// 	e.preventDefault()
// })

register_btn.addEventListener('click', (e) => {
	const email_personal = document.getElementById("email_personal");
	const password_personal = document.getElementById("password_personal");
	signUp(email_personal.value, password_personal.value, e)
})

// register_btn.addEventListener("onClick", (e) => {

// })

function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function (e) {
			$('#blah')
				.attr('src', e.target.result);
		};

		reader.readAsDataURL(input.files[0]);
		return input.files[0]
	}
}
function readURL1(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function (e) {
			$('#blah1')
				.attr('src', e.target.result);
		};

		reader.readAsDataURL(input.files[0]);
		return input.files[0]
	}
}

async function sendMail(data, person) {
	if (person === "user") {
		fetch("https://ujvaljobs-backend-dk.vercel.app/user-registration", { method: "POST", body: JSON.stringify(data) });
	} else {
		fetch("https://ujvaljobs-backend-dk.vercel.app/company-registration", { method: "POST", body: JSON.stringify(data) });
	}
}

// const file = readURL(profilephoto_personal)

const signUp = (email, password, e) => {
	e.target.innerText = 'Registering...';
	e.target.disabled = true
	const username_personal = document.getElementById("username_personal");
	const firstname_personal = document.getElementById("firstname_personal");
	const lastname_personal = document.getElementById("lastname_personal");
	const email_personal = document.getElementById("email_personal");
	const password_personal = document.getElementById("password_personal");
	const confirmpassword_personal = document.getElementById("confirmpassword_personal");
	const qualification_personal = document.getElementById("qualification_personal");
	const experience_personal = document.getElementById("experience_personal");
	const lastwork_personal = document.getElementById("lastwork_personal");
	const phone_personal = document.getElementById("phone_personal");
	const city_personal = document.getElementById("city_personal");
	const zipcode_personal = document.getElementById("zipcode_personal");
	const country_personal = document.getElementById("country_personal");
	const porfolio_personal = document.getElementById("porfolio_personal");
	const profilephoto_personal = document.getElementById("profilephoto_personal");
	const address_personal = document.getElementById("address_personal");
	const cv_personal = document.getElementById("cv_personal");


	firebase.auth().createUserWithEmailAndPassword(email, password)
		.then((userCredential) => {
			var user = userCredential.user;
			let profileURL = "";
			e.target.innerText = 'Setting up your profile...';
			e.target.disabled = true
			db.collection("USERS").doc(user.uid).set({
				username: username_personal.value,
				firstname: firstname_personal.value,
				lastname: lastname_personal.value,
				email: email_personal.value,
				qualification: qualification_personal.value,
				experience: experience_personal.value,
				lastwork: lastwork_personal.value,
				phonenumber: phone_personal.value,
				city: city_personal.value,
				zipcode: zipcode_personal.value,
				country: country_personal.value,
				portfolio: porfolio_personal.value,
				address: address_personal.value,
				photoURL: profileURL,
				cvURL: "",
				subscription: "free",
				subscriptionDetails: {}
			})
				.then(() => {
					e.target.innerText = 'Create Account';
					e.target.disabled = false
					sendMail({ email: user.email }, "user")
					alert('Account created successfully, you will be redirected soon to login page')
					window.location.href = '/login.html'
					// const cvURL = uploadFiles("USERS", user.uid, `CV/${readURL(cv_personal).name}`, readURL(cv_personal))
				})
				.catch((error) => {
					e.target.innerText = 'Create Account';
					e.target.disabled = false
					console.error("Error writing document: ", error);
					alert(error.message)
				});


		})
		.catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			alert(error.message)
			e.target.innerText = 'Create Account';
			e.target.disabled = false
			// ..
		});

}

const uploadFiles = (role, id, filename, file) => {
	let cvURL = "";
	var uploadTask = storageRef.child(`${role}/${id}/${filename}`).put(file);
	uploadTask.on('state_changed',
		(snapshot) => {
			var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		},
		(error) => {
			// Handle unsuccessful uploads
		},
		() => {
			uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
				cvURL = downloadURL;
				var docRef = db.collection(role).doc(id);
				var updateCV = docRef.update({
					cvURL
				}).then(() => {
					setTimeout(() => {
						window.location.href = "/"
					}, 1000);
				})
					.catch((err) => {
					})
			});
		}
	);
	return cvURL
}