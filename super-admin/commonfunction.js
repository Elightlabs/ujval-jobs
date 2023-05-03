const signout = () => {
	firebase.auth().signOut().then(() => {
		// Sign-out successful.
	}).catch((error) => {
		// An error happened.
	});
}


firebase.auth().onAuthStateChanged((user) => {
	if (user) {
		return
	}
	else {
		if (window.location.href.includes('login')) {
			return
		} else {
			window.location.href = "./login/"
		}
	}
});


const forgetPassword = () => {
	const email = document.getElementById('email').value
	if (email.length === 0) {
		alert("Please Enter A Valid Email!")
	}
	else {
		firebase.auth().sendPasswordResetEmail(email)
			.then(() => {
				alert("Password Reset Email Sent!")
			})
			.catch((error) => {
				var errorCode = error.code;
				var errorMessage = error.message;
				// ..
			});
	}

}

try {
	const data = JSON.parse(window.sessionStorage.getItem('user'))
	document.getElementById("sidebarName").innerHTML = data.company
	document.getElementById("sidebarProfile").src = data.photoURL
} catch (error) {
}