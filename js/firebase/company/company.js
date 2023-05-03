const img_right = document.getElementById('img_right');
const title_right = document.getElementById('title_right');
const jobdescription = document.getElementById('jobdescription');
const company_right = document.getElementById('company_right');
const location_right = document.getElementById('location_right');
const jobType_right = document.getElementById('jobType_right');
const jobTiming_right = document.getElementById('jobTiming_right');
const salary_right = document.getElementById('salary_right');
const experience_right = document.getElementById('experience_right');
const qualification = document.getElementById('qualification');
const jobHeading = document.getElementById('jobHeading');
const jobCompany = document.getElementById('jobCompany');
const locationMain = document.getElementById('location');
const jobTypeTop = document.getElementById('jobTypeTop');
const jobCategory = document.getElementById('jobCategory');
const jobsector_right = document.getElementById('jobsector_right');
const website = document.getElementById('website');
const jobDate = document.getElementById('jobDate');

const fetchCompanyData = () => {
	const user = firebase.auth().currentUser
	if (user === null) {
		const dataID = JSON.parse(window.sessionStorage.getItem('job'))
		const db = firebase.firestore()
		db.collection("JOBS").doc(dataID.jobID)
			.onSnapshot((doc) => {
				let obj = doc.data()
				obj.id = doc.id
				window.sessionStorage.setItem("jobDetails", JSON.stringify(obj))
				company_right.innerHTML = doc.data().company
				img_right.src = doc.data().companyIMG
				title_right.innerHTML = doc.data().jobtitle
				website.innerHTML = doc.data().website
				website.href = doc.data().website
				jobType_right.innerHTML = doc.data().jobtype
				jobCategory.innerHTML = doc.data().jobcategory
				jobsector_right.innerHTML = doc.data().jobsector
				jobTypeTop.innerHTML = doc.data().jobtype
				jobdescription.innerText = doc.data().jobdescription
				jobTiming_right.innerHTML = doc.data().jobtimings
				location_right.innerHTML = doc.data().joblocation
				locationMain.innerHTML = doc.data().joblocation
				qualification.innerHTML = doc.data().qualification
				jobHeading.innerHTML = `${doc.data().jobtitle} (${doc.data().experience})`
				experience_right.innerHTML = `${doc.data().experience}`
				salary_right.innerHTML = `${doc.data().salary}`
				jobCompany.innerHTML = `${doc.data().company}`
				jobDate.innerHTML = `${doc.data().date}`
			});
	}else{
		window.location.href = "/login.html"
	}
	
}

fetchCompanyData()