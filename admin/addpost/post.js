const db = firebase.firestore();
const postButton = document.getElementById("postButton")
let cityJSON = JSON.parse('["Mumbai","Pune","Nagpur","Nashik","Vasai-Virar","Aurangabad","Solapur","Bhiwandi","Amravati","Malegaon","Kolhapur","Nanded","Sangli","Jalgaon","Akola","Latur","Ahmadnagar","Dhule","Ichalkaranji","Chandrapur","Parbhani","Jalna","Bhusawal","Navi Mumbai","Panvel","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"]')
let jobpostform = document.getElementById('jobpostform')

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
	return dateString
}

const user = JSON.parse(window.sessionStorage.getItem('user'))
if (user.subscription === 'Trial') {
	jobdescription.addEventListener('change', (e) => {
		if (e.target.value.length < 200) {
			return
		} else {
			let onlyChars = e.target.value.subString(0, 200)
			e.target.value = onlyChars
		}
	})
} else if (user.subscription === 'Classic') {
	jobdescription.addEventListener('change', (e) => {
		if (e.target.value.length < 300) {
			return
		} else {
			let onlyChars = e.target.value.subString(0, 300)
			e.target.value = onlyChars
		}
	})
} else if (user.subscription === 'Standard') {
	jobdescription.addEventListener('change', (e) => {
		if (e.target.value.length < 500) {
			return
		} else {
			let onlyChars = e.target.value.subString(0, 500)
			e.target.value = onlyChars
		}
	})
} else if (user.subscription === 'Premium') {
	jobdescription.addEventListener('change', (e) => {
		if (e.target.value.length < 500) {
			return
		} else {
			let onlyChars = e.target.value.subString(0, 500)
			e.target.value = onlyChars
		}
	})
} else if (user.subscription === 'Silver') {
	jobdescription.addEventListener('change', (e) => {
		if (e.target.value.length < 1000) {
			return
		} else {
			let onlyChars = e.target.value.subString(0, 1000)
			e.target.value = onlyChars
		}
	})
} else if (user.subscription === 'Gold') {
}else{
	window.location.href = "../pricing/"
}

const addJobData = () => {
	postButton.disabled = true
	var storage = firebase.storage();
	var storageRef = storage.ref();
	const jobtitle = document.getElementById('jobtitle').value
	const joblocation = document.getElementById('joblocation').value
	const salary = document.getElementById('salary').value
	const qualification = document.getElementById('qualification').value
	const jobsector = document.getElementById('jobsector').value
	const gender = document.getElementById('gender').value
	const experience = document.getElementById('experience').value
	const jobtimings = document.getElementById('jobtimings').value
	const jobtype = document.getElementById('jobtype').value
	const jobcategory = document.getElementById('jobcategory').value
	const jobdescription = document.getElementById('jobdescription').value
	const jobfile = document.getElementById('jobfile')
	// const user = JSON.parse(window.sessionStorage.getItem('user'))

	if (jobfile.files.length === 0) {
		db.collection("COMPANY").doc(user.uid)
			.onSnapshot((doc) => {
				user.subscription = doc.data().subscription
				user.username = doc.data().username
				user.website = doc.data().website
				user.photoURL = doc.data().photoURL
				user.disabled = doc.data().disabled
				user.company = doc.data().company
				user.addressline = doc.data().addressline
			});
		window.sessionStorage.setItem('user', JSON.stringify(user))
		try {
			document.getElementById("sidebarName").innerHTML = user.company
			document.getElementById("sidebarProfile").src = user.photoURL
		} catch (error) {
		}
		const data = {
			jobtitle,
			joblocation,
			salary,
			qualification,
			jobsector,
			gender,
			experience,
			jobtimings,
			jobtype,
			jobcategory,
			jobdescription,
			company: user.company,
			companyID: user.uid,
			files: "",
			companyIMG: user.photoURL,
			website: user.website,
			date: getDate()
		}
		if (user.disabled) {
			alert('You are disabled by the admin')
		}
		else {

			db.collection("JOBS").add(data)
				.then((docRef) => {
					window.alert('Job Posted')
				})
				.catch((error) => {
					console.error("Error adding document: ", error);
				});
		}
	}
	else {
		var uploadTask = storageRef.child(`JOBS/${user.uid}/${jobfile.files[0].name}`).put(jobfile.files[0]);
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
					('File available at', downloadURL);
					const data = {
						jobtitle,
						joblocation,
						salary,
						qualification,
						jobsector,
						gender,
						experience,
						jobtimings,
						jobtype,
						jobcategory,
						jobdescription,
						company: user.company,
						companyID: user.id,
						files: downloadURL,
						companyIMG: user.photoURL
					}
					if (user.disabled) {
						alert('You are disabled by the admin')
					} else {
						db.collection("JOBS").add(data)
							.then((docRef) => {
								window.alert('Job Posted')
								jobpostform.reset()
								postButton.disabled = false
							})
							.catch((error) => {
								console.error("Error adding document: ", error);
							});
					}
				});
			}
		);
	}
}

postButton.addEventListener('click', (e) => {
	e.preventDefault()
	// const user = firebase.auth().currentUser
	if (user) {
		let postedJob = []
		db.collection("JOBS").where("companyID", "==", user.uid)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					postedJob.push(doc.data())
				});
				let data = JSON.parse(window.sessionStorage.getItem('user'))
				if (data.subscription === 'Trial') {
					if (postedJob.length < 1) {
						addJobData()
					} else {
						alert('Only 1 Job is allowed to post in Trial Subscription Plan')
					}
				}
				else if (data.subscription === 'Classic') {
					if (postedJob.length < 1) {
						addJobData()
					} else {
						alert('Only 1 Job is allowed to post in Classic Subscription Plan')
					}
				}
				else if (data.subscription === 'Standard') {
					if (postedJob.length < 2) {
						addJobData()
					} else {
						alert('Only 2 Job are allowed to post in Standard Subscription Plan')
					}
				}
				else if (data.subscription === 'Premium') {
					if (postedJob.length < 4) {
						addJobData()
					} else {
						alert('Only 4 Job are allowed to post in Premium Subscription Plan')
					}
				}
				else if (data.subscription === 'Silver') {
					if (postedJob.length < 20) {
						addJobData()
					} else {
						alert('Only 20 Job are allowed to post in Silver Subscription Plan')
					}
				}
				else if (data.subscription === 'Gold') {
					if (postedJob.length < 30) {
						addJobData()
					} else {
						alert('Only 30 Job are allowed to post in Gold Subscription Plan')
					}
				}
			})
			.catch((error) => {
			});
		addJobData()
	}
})

cityJSON.forEach((city) => {
	document.getElementById('joblocation').innerHTML += `<option value='${city}'>${city}</option>`
})

