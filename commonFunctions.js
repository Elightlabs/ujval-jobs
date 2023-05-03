const signout = () => {
	firebase.auth().signOut().then(() => {
		window.sessionStorage.removeItem('currentuser')
		window.location.href = "/login.html"
	}).catch((error) => {
		// An error happened.
	});
}

firebase.auth().onAuthStateChanged((user) => {
	const db = firebase.firestore()
	if (user) {
		db.collection("USERS").doc(user.uid)
			.onSnapshot((doc) => {
				if (doc.exists) {
					let obj = doc.data()
					obj.id = doc.id
					let newDate = new Date()
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
				} else {
					// doc.data() will be undefined in this case
				}
			});
	}

	try {
		let profilePage = document.querySelectorAll('.profile-page')
		let signoutBtn = document.querySelectorAll('.signout-btn')
		let loginBtn = document.querySelectorAll('.login-btn')
		let postjob = document.querySelectorAll('.postjob')
		let foremployees = document.querySelectorAll('.foremployees')
		if (user) {
			profilePage.forEach((item) => {
				item.style.display = ''
			})
			signoutBtn.forEach((item) => {
				item.style.display = ''
			})
			loginBtn.forEach((item) => {
				item.style.display = 'none'
			})
			postjob.forEach((item) => {
				item.style.display = 'none'
			})
			foremployees.forEach((item) => {
				item.style.display = 'none'
			})
			var docRef = db.collection("USERS").doc(user.uid);
			docRef.get().then((doc) => {
				if (doc.exists) {
					let obj = doc.data()
					obj.id = doc.id
					window.sessionStorage.setItem("currentuser", JSON.stringify(obj))
				}
			}).catch((error) => {
			});
		} else {
			profilePage.forEach((item) => {
				item.style.display = 'none'
			})
			signoutBtn.forEach((item) => {
				item.style.display = 'none'
			})
			loginBtn.forEach((item) => {
				item.style.display = ''
			})
			postjob.forEach((item) => {
				item.style.display = ''
			})
			foremployees.forEach((item) => {
				item.style.display = ''
			})
			if (window.location.pathname.includes("candidate_profile")) {
				window.location.href = "/login.html"
			}
		}
	}
	catch (error) {

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
				alert(error.message)
			});
	}

}

const handleLoginCheck = () => {
	const user = firebase.auth().currentUser
	if (user) {
		window.location.href = "/candidate_profile.html"
	} else {
		window.location.href = "/login.html"
	}
}