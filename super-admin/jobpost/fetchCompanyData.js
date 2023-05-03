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
const jobDate = document.getElementById('jobDate');
const applications = document.getElementById('applications');
const params = new URLSearchParams(document.location.search);
const uid = params.get("uid");
const fetchCompanyData = () => {
	const user = firebase.auth().currentUser
	if (user === null) {
		const db = firebase.firestore()
		db.collection("JOBS").doc(uid)
			.onSnapshot((doc) => {
				let obj = doc.data()
				obj.id = doc.id
				company_right.innerHTML = doc.data().company
				img_right.src = doc.data().companyIMG
				title_right.innerHTML = doc.data().jobtitle
				jobType_right.innerHTML = doc.data().jobtype
				jobCategory.innerHTML = doc.data().jobcategory
				jobsector_right.innerHTML = doc.data().jobsector
				jobTypeTop.innerHTML = doc.data().jobtype
				jobdescription.innerText = doc.data().jobdescription
				jobTiming_right.innerHTML = doc.data().jobtimings
				location_right.innerHTML = doc.data().joblocation
				locationMain.innerHTML = doc.data().joblocation
				qualification.innerHTML = doc.data().qualification
				experience_right.innerHTML = `${doc.data().experience}`
				salary_right.innerHTML = `${doc.data().salary}`
				jobDate.innerHTML = `${doc.data().date}`
				applications.href = `../applicants/?jobId=${uid}`
			});
	}else{
		window.location.href = "/login.html"
	}
	
}

fetchCompanyData()