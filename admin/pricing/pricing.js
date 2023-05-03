const handlePricing = (plan, amount, days) => {
	const user = firebase.auth().currentUser
	window.localStorage.setItem('ApplicationForSubscriptionCompany', JSON.stringify({ amount: amount, plan, plan, days: days }));
	let paramString = window.location.href.split('?')[1];
	let queryString = new URLSearchParams(paramString);
	if (queryString.get("update") !== "true" && !user) {
		window.location.href = "../create_account/"
	} else {
		generateOrder(amount, plan, days, user)
	}
}

const generateOrder = async (amount, plan, days, user) => {
	// https://ujvaljobs-backend-dk.vercel.app/order?amount=${amount * 100}&currency=INR
	await fetch(`https://ujvaljobs-backend-dk.vercel.app/order?amount=${amount * 100}&currency=INR`, {
		method: 'POST',
	})
		.then(x => x.json())
		.then((data) => {
			const db = firebase.firestore()
			if (!user) {
				window.location.href = "../login/"
			}
			var docRef = db.collection("COMPANY").doc(user && user.uid);
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
			if (user) {

			} else {
				window.location.href = "../login/"
			}
		});
}


const successFunc = (data, plan, days) => {
	data.subscription = plan
	data.isSubscribed = true
	data.validtill = getValidTillTimestamp(days)
	const db = firebase.firestore()
	var docRef = db.collection("COMPANY").doc(firebase.auth().currentUser.uid);
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