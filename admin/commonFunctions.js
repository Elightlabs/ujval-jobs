const signout = () => {
	firebase.auth().signOut().then(() => {
		// window.sessionStorage.removeItem('user')
		setTimeout(() => {
			window.location.href = `${window.location.origin}/admin/login`
		}, 1000);
	}).catch((error) => {
		// An error happened.
	});
}
// let user;
// let user = JSON.parse(window.sessionStorage.getItem('user'))
// if (!user) {
// 	if (!window.location.href.includes('login')) {
// 		signout()
// 	}
// }

firebase.auth().onAuthStateChanged((currentuser) => {
	if (currentuser) {
		const db = firebase.firestore()
		db.collection("COMPANY").doc(currentuser.uid)
			.onSnapshot((doc) => {
				if (doc.exists) {
					if (window.location.href.includes('create_account') || window.location.href.includes('login')) {
						return
					}
					let obj2
					obj2 = doc.data()
					obj2.uid = doc.id
					if (location.href.includes('login') || location.href.includes('create_account') || location.href.includes('pricing')) {
						return
					} else {
						if (!doc.data().isSubscribed) {
							if (location.pathname.includes('/admin/pricing')) {
								if (user) {
									window.location.href = "./pricing/?update=true"
								} else {
									return
								}
							}
							else {
								window.location.href = "./pricing/?update=true"
							}
						}
					}
					window.sessionStorage.setItem('user', JSON.stringify(obj2))
					try {
						document.getElementById("sidebarName").innerHTML = doc.data().company
						document.getElementById("sidebarProfile").src = doc.data().photoURL
					} catch (error) {
					}
				} else {
					if (window.location.href.includes('login') || window.location.href.includes('create_account') || location.href.includes('pricing')) {
						return
					} else {
						window.location.href = "../login/"
					}
				}
			});
	}
	else {
		if (location.href.includes("login") || location.href.includes(`/create_account`) || location.href.includes('pricing')) {
			return
		} else {
			window.location.href = `${window.location.origin}/admin/login`
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