const email = document.getElementById('email');
const password = document.getElementById('password');
const login_btn = document.getElementById('login_btn');
const db = firebase.firestore()

login_btn.addEventListener('click', (e) => {
	if (email.value.length > 0 && password.value.length > 0) {
		login(email.value, password.value, e)
	}else{
		alert('Fill the form properly!');
	}
})


const login = (email, password, e) => {
	e.target.innerText = 'Logging In...'
	e.target.disabled = true
	firebase.auth().signInWithEmailAndPassword(email, password)
		.then((userCredential) => {
			e.target.innerText = 'Loading...';
			e.target.disabled = true
			var user = userCredential.user;
			if (user.displayName === 'COMPANY') {
				window.location.href = '/admin/login/'
				signout()

			} else {
				var docRef = db.collection("USERS").doc(user.uid);
				docRef.get().then((doc) => {
					if (doc.exists) {
						let obj = doc.data()
						obj.id = doc.id
						let newDate = new Date()
						if (doc.data().subscription === "free" && !window.location.href.includes('pricing.html')) {
							window.location.href = './pricing.html'
						}
						if (doc.data().validtill < newDate.getTime()) {
							var docRef1 = db.collection("USERS").doc(user.uid);
							docRef1.update({
								isSubscribed: false,
								validtill: 0,
								plan: 'free'
							})
								.then(() => {
								})
								.catch((error) => {
									// The document probably doesn't exist.
									console.error("Error updating document: ", error);
								});
						}
						window.sessionStorage.setItem("currentuser", JSON.stringify(obj))
						if (user.displayName == 'USER') {
							window.location.href = "/"
						}
					} else {
						// doc.data() will be undefined in this case
					}
				}).catch((error) => {
					alert(error.message);
					e.target.disabled = false
					e.target.innerText = 'Login'
				});
			}
		})
		.catch((error) => {
			e.target.disabled = false
			alert(error.message);
			e.target.innerText = 'Login'
			var errorCode = error.code;
			var errorMessage = error.message;
		});

}