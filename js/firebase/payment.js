const handlePayment = (amount, plan) => {
	window.localStorage.setItem('ApplicationForSubscription', JSON.stringify({ amount: amount, plan, plan }));
	const user = firebase.auth().currentUser;
	if (user) {
		generateOrder(amount, plan)
	} else {
		window.location.href = "login.html"
	}
}


const generateOrder = async (amount, plan) => {
      let headers = new Headers();
  headers.append('Content-Type', 'application/json');
  headers.append('Accept', 'application/json');

  headers.append('Access-Control-Allow-Origin', 'https://ujvaljobs-backend-dk.vercel.app/');
  headers.append('Access-Control-Allow-Credentials', 'true');
//   https://ujvaljobs-backend-dk.vercel.app/order?amount=${amount * 100}&currency=INR
  headers.append('GET', 'POST', 'OPTIONS');
	await fetch(`https://ujvaljobs-backend-dk.vercel.app/order?amount=${amount * 100}&currency=INR`, {
		method: 'POST',
		headers: headers
	})
		.then((response) => response.json())
		.then((data) => {
			const db = firebase.firestore()
			const user = JSON.parse(window.sessionStorage.getItem('currentuser'))
			if (!user) {
				window.location.href = "/login.html"
			}
			var docRef = db.collection("USERS").doc(user && user.id);
			docRef.get().then((doc) => {
				if (doc.exists) {
					if (!doc.data().isSubscribed) {
						var options = {
							"key": "rzp_live_KvV5bL42EhSq9s", // Enter the Key ID generated from the Dashboard
							"amount": amount * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
							"currency": "INR",
							"name": "Ujval Jobs",
							"description": `Amount for ${plan} Plan`,
							"image": "https://ujvaljob.com/images/header/logo.png",
							"order_id": data.id,
							"handler": function (response) {
								successFunc(response, plan)
							},
							"prefill": {
								"name": user.username,
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
			if (user) {

			} else {
				window.location.href = "/login.html"
			}
		});
}


const successFunc = (data, plan) => {
	data.plan = plan
	data.isSubscribed = true
	data.validtill = getValidTillTimestamp(28)
	const db = firebase.firestore()
	var docRef = db.collection("USERS").doc(firebase.auth().currentUser.uid);
	docRef.update(data)
		.then(() => {
			alert("Document successfully updated!");
			// window.location.href = "/"
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