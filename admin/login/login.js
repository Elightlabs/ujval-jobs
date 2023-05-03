const db = firebase.firestore()
const login_form = document.getElementById('login_form');

login_form.addEventListener('submit', (e) => {
	e.preventDefault()
	login()
})


const login = () => {
	const email = document.getElementById('email');
	const password = document.getElementById('password');
	firebase.auth().signInWithEmailAndPassword(email.value, password.value)
		.then((userCredential) => {
			var user = userCredential.user;
			if (user.displayName === "USER") {
				window.alert("Your Email Is Registered As User!")
				firebase.auth().signOut().then(() => {
				}).catch((error) => {
					alert(error.message)
				});
			} else {
				db.collection("COMPANY").doc(user.uid)
					.onSnapshot((doc) => {
						if (doc.exists) {
							let obj = doc.data()
							let newDate = new Date()
							// obj.uid = doc.id
							if (doc.data().validtill < newDate.getTime()) {
								var docRef1 = db.collection("COMPANY").doc(user.uid);
								docRef1.update({
									isSubscribed: false,
									validtill: 0,
									plan: 'Trial'
								})
									.then(() => {
									})
									.catch((error) => {
										// The document probably doesn't exist.
										console.error("Error updating document: ", error);
									});
							}
							if (!doc.data().subscription) {
								window.location.href = "../pricing/"
							} else {
								setTimeout(() => {
									window.location.href = "../"
								}, 1000);
							}
							window.sessionStorage.setItem('user', JSON.stringify(obj))
							try {
								// document.getElementById("sidebarName").innerHTML = doc.data().company
								// document.getElementById("sidebarProfile").src = doc.data().photoURL
							} catch (error) {
								alert(error.message)
							}
						}
					})
			}
		})
		.catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			window.alert(errorMessage)
		});

}