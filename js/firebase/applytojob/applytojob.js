const applynow_btn = document.getElementById('applynow_btn');
let enableJob = true
const db = firebase.firestore()


const getDate = () => {
	const dateOBJ = new Date();
	let date = dateOBJ.getDate()
	if (date <= 9) {
		date = `0${date}`
	}
	let month = dateOBJ.getMonth() + 1
	if (month <= 9) {
		month = `0${month}`
	}
	let year = dateOBJ.getFullYear()
	let dateString = `${date}-${month}-${year}`
	let obj = {
		dateString,
	}
	return obj
}

const handleChecking = async () => {
	const userData = JSON.parse(window.sessionStorage.getItem("currentuser"))
	var docRef = await db.collection("USERS").doc(userData.id);
	await docRef.get()
		.then((res) => {
			const jobData = JSON.parse(window.sessionStorage.getItem("jobDetails"))
			if (res.data().appliedTo) {
				res.data().appliedTo.forEach((job) => {
					if (job.jobID === jobData.id) {
						applynow_btn.innerHTML = "Already Applied!"
						applynow_btn.disabled = true
						enableJob = false
						return
					}
				})
			}
		})
}

handleChecking()

const handleMail = (data) => {
	fetch("https://ujvaljobs-backend-dk.vercel.app/applied-successfully", { method: "POST", body: JSON.stringify(data) });
}

applynow_btn.addEventListener('click', async () => {
	let user = firebase.auth().currentUser;
	if (!user) {
		window.location.href = '/login.html'
	} else {
		const db = firebase.firestore()
		const user = firebase.auth().currentUser
		var docRef = db.collection("USERS").doc(user.uid);
		const jobData = JSON.parse(window.sessionStorage.getItem("jobDetails"))
		if (enableJob) {
			const userData = JSON.parse(window.sessionStorage.getItem("currentuser"))
			docRef.update({
				appliedTo: firebase.firestore.FieldValue.arrayUnion({
					jobID: jobData.id,
					companyID: jobData.companyID,
					company: jobData.company,
					salary: jobData.salary,
					date: getDate().dateString,
					companyIMG: jobData.companyIMG
				})
			})
				.then(() => {
					db.collection("COMPANY").doc(jobData.companyID).collection("APPLICATIONS").add({
						userID: userData.id,
						firstname: userData.firstname,
						lastname: userData.lastname,
						date: getDate().dateString,
						userIMG: userData.photoURL,
						userEmail: userData.email,
						jobID: jobData.id,
						jobTitle: jobData.jobtitle
					})
						.then((docRef) => {
							window.alert("Applied Successfully")
							applynow_btn.innerHTML = "Applied!"
							handleMail({job: jobData.jobTitle, email: userData.email})
							applynow_btn.disabled = true
							enableJob = false
						})
						.catch((error) => {
							console.error("Error adding document: ", error);
						});

				})
				.catch((error) => {
					// The document probably doesn't exist.
					console.error("Error updating document: ", error);
				});
		}
	}

})