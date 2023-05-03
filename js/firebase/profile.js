const userData = JSON.parse(window.sessionStorage.getItem("currentuser"))
const db = firebase.firestore()
const profileImg = document.getElementById('profileImg')
const name = document.getElementById('name')
const downloadResume = document.getElementById('downloadResume')
const username = document.getElementById('username')
const lastname = document.getElementById('lastname')
const email = document.getElementById('email')
const phone = document.getElementById('phone')
const portfolio = document.getElementById('portfolio')
const qualification = document.getElementById('qualification')
const experience = document.getElementById('experience')
const lastwork = document.getElementById('lastwork')
const city = document.getElementById('city')
const address = document.getElementById('address')
const zipcode = document.getElementById('zipcode')
const btnEdit = document.getElementById('btnEdit')
const btnSave = document.getElementById('btnSave')
const resumeForm = document.getElementById('resumeForm')
const subplan = document.getElementById('subplan')
let flag = false

profileImg.src = userData.photoURL
name.innerHTML = `${userData.firstname} ${userData.lastname}`
username.innerHTML = userData.firstname
lastname.innerHTML = userData.lastname
email.innerHTML = userData.email
phone.innerHTML = userData.phonenumber
portfolio.innerHTML = userData.portfolio
portfolio.href = userData.portfolio
qualification.innerHTML = userData.qualification
lastwork.innerHTML = userData.lastwork
experience.innerHTML = userData.experience
city.innerHTML = userData.city
address.innerHTML = userData.address
zipcode.innerHTML = userData.zipcode
downloadResume.href = userData.cvURL
subplan.href = userData.plan

db.collection("USERS").doc(userData.id)
	.onSnapshot((doc) => {
		let data = doc.data()
		data.id = doc.id
		window.sessionStorage.setItem('currentuser', JSON.stringify(data))
		profileImg.src = userData.photoURL
		name.innerHTML = `${userData.firstname} ${userData.lastname}`
		username.innerHTML = userData.firstname
		lastname.innerHTML = userData.lastname
		email.innerHTML = userData.email
		phone.innerHTML = userData.phonenumber
		portfolio.innerHTML = userData.portfolio
		portfolio.href = userData.portfolio
		qualification.innerHTML = userData.qualification
		lastwork.innerHTML = userData.lastwork
		experience.innerHTML = userData.experience
		city.innerHTML = userData.city
		address.innerHTML = userData.address
		zipcode.innerHTML = userData.zipcode
		downloadResume.href = userData.cvURL
		subplan.innerHTML = userData.subscription
	});

btnSave.addEventListener('click', () => {
	var docRef = db.collection("USERS").doc(userData.id);
	docRef.update({
		firstname: username.innerHTML,
		lastname: lastname.innerHTML,
		email: email.innerHTML,
		phonenumber: phone.innerHTML,
		portfolio: portfolio.innerHTML,
		qualification: qualification.innerHTML,
		lastwork: lastwork.innerHTML,
		experience: experience.innerHTML,
		city: city.innerHTML,
		address: address.innerHTML,
		zipcode: zipcode.innerHTML,
	})
		.then(() => {
			alert("Profile successfully updated!");
			setTimeout(() => {
				window.location.reload()
			}, 1000);
		})
		.catch((error) => {
			alert("Error updating document: ");
		});
})
btnEdit.addEventListener('click', () => {
	btnSave.style.display = "block"
	username.contentEditable = true
	lastname.contentEditable = true
	email.contentEditable = true
	phone.contentEditable = true
	portfolio.contentEditable = true
	qualification.contentEditable = true
	lastwork.contentEditable = true
	experience.contentEditable = true
	city.contentEditable = true
	address.contentEditable = true
	zipcode.contentEditable = true
	username.focus()
})

const resumeInput = document.getElementById('resumeInput')
const resumeBtn = document.getElementById('resumeBtn')
const resumeText = document.getElementById('resumeText')
const imgUpload = document.getElementById('imgUpload')

profileImg.addEventListener('click', () => {
	imgUpload.click()
})
imgUpload.addEventListener('change', (e) => {
	let file = e.target.files[0]
	var storageRef = firebase.storage().ref();
	var uploadTask = storageRef.child(`USERS/${userData.id}/${userData.id}.jpg`).put(file);
	uploadTask.on('state_changed',
		(snapshot) => {
			var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			switch (snapshot.state) {
				case firebase.storage.TaskState.PAUSED: // or 'paused'
					break;
				case firebase.storage.TaskState.RUNNING: // or 'running'
					break;
			}
		},
		(error) => {
			// Handle unsuccessful uploads
		},
		() => {
			uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
				var docRef = db.collection("USERS").doc(userData.id);
				docRef.update({
					photoURL: downloadURL
				}).then(() => {
					alert('Profile Updated Successfully!');
					setTimeout(() => {
						window.location.reload()
					}, 1000);
				})
					.catch((err) => {
					})
			});
		})
})


resumeBtn.addEventListener('click', () => {
	resumeInput.click()
})

resumeInput.addEventListener('change', (e) => {
	let file = e.target.files[0]
	var storageRef = firebase.storage().ref();
	var uploadTask = storageRef.child(`USERS/${userData.id}/CV/${file.name}`).put(file);
	uploadTask.on('state_changed',
		(snapshot) => {
			resumeText.innerText = "Uploading..."
			var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
			switch (snapshot.state) {
				case firebase.storage.TaskState.PAUSED: // or 'paused'
					break;
				case firebase.storage.TaskState.RUNNING: // or 'running'
					break;
			}
		},
		(error) => {
			// Handle unsuccessful uploads
		},
		() => {
			uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
				var docRef = db.collection("USERS").doc(userData.id);
				var updateCV = docRef.update({
					cvURL: downloadURL
				}).then(() => {
					alert('Resume Updated Successfully!');
					resumeText.innerText = "ADD RESUME"
					resumeForm.reset()
				})
					.catch((err) => {
					})
			});
		}
	);

})