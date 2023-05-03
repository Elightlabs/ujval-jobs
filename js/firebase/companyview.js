const companylogo1 = document.getElementById('companylogo1')
const companyname2 = document.getElementById('companyname2')
const noOfJobs = document.getElementById('noOfJobs')
const location1 = document.getElementById('location1')
const locationFirst = document.getElementById('location')
const noOfJobs2 = document.getElementById('noOfJobs2')
const jobsURL = document.getElementById('jobsURL')
const companyname = document.getElementById('companyname')
const companyname1 = document.getElementById('companyname1')
const companywebsite = document.getElementById('companywebsite')
const companydescription = document.getElementById('companydescription')
const companylogo = document.getElementById('companylogo')
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
const db = firebase.firestore()

db.collection("COMPANY").doc(id)
.onSnapshot((doc) => {
	companylogo.src = doc.data().photoURL
	companylogo1.src = doc.data().photoURL
	companyname2.innerHTML = doc.data().company
	location1.innerHTML = doc.data().addressline
	locationFirst.innerHTML = doc.data().addressline
	jobsURL.href = `/listing_right.html?id=${doc.id}`
	companyname.innerHTML = doc.data().company
	companyname1.innerHTML = doc.data().company
	companydescription.innerHTML = doc.data().description
	companywebsite.href = doc.data().website
	companywebsite.innerHTML = doc.data().website
});
