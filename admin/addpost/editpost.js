const params = new URLSearchParams(document.location.search);
const id = params.get("id");
const updateButton = document.getElementById('updateButton')

if (id) {
	db.collection('JOBS').doc(id).get()
		.then((doc) => {
			postButton.style.display = 'none'
			document.getElementById('jobtitle').value = doc.data().jobtitle
			document.getElementById('joblocation').value = doc.data().joblocation
			document.getElementById('salary').value = doc.data().salary
			document.getElementById('qualification').value = doc.data().qualification
			document.getElementById('jobsector').value = doc.data().jobsector
			document.getElementById('gender').value = doc.data().gender
			document.getElementById('experience').value = doc.data().experience
			document.getElementById('jobtimings').value = doc.data().jobtimings
			document.getElementById('jobtype').value = doc.data().jobtype
			document.getElementById('jobcategory').value = doc.data().jobcategory
			document.getElementById('jobdescription').value = doc.data().jobdescription
			document.getElementById('postCompany').style.display = 'none'
			document.getElementById('postButton').innerHTML = 'Update Job Post'
		})
		.catch((err) => {
			window.alert(err.message)
		})

} else {
	updateButton.style.display = 'none'
}
updateButton.addEventListener('click', () => {
	const data = {
		jobtitle: document.getElementById('jobtitle').value,
		joblocation: document.getElementById('joblocation').value,
		salary: document.getElementById('salary').value,
		qualification: document.getElementById('qualification').value,
		jobsector: document.getElementById('jobsector').value,
		gender: document.getElementById('gender').value,
		experience: document.getElementById('experience').value,
		jobtimings: document.getElementById('jobtimings').value,
		jobtype: document.getElementById('jobtype').value,
		jobcategory: document.getElementById('jobcategory').value,
		jobdescription: document.getElementById('jobdescription').value,
	}
	db.collection("JOBS").doc(id).update(data)
		.then((docRef) => {
			window.alert('Job Post Updated')
			window.location.href = '../jobs/'
		})
		.catch((error) => {
			console.error("Error adding document: ", error);
		});
})