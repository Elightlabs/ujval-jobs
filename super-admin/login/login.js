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
					("Sign-out successful.")
				}).catch((error) => {
					// An error happened.
				});
			} else {
				window.location.href = "../index.html"
			}
		})
		.catch((error) => {
			var errorCode = error.code;
			var errorMessage = error.message;
			window.alert(errorMessage)
		});

}