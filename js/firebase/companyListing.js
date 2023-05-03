const companyList = document.getElementById('companyList');
let lastDoc = null
const db = firebase.firestore()
const urlParams = new URLSearchParams(window.location.search);
const jobID = urlParams.get('jobId');

const template = `
<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
<div class="jp_job_post_main_wrapper_cont jp_job_post_grid_main_wrapper_cont">
	<div class="jp_job_post_main_wrapper jp_job_post_grid_main_wrapper">
		<div class="row">
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<div class="jp_job_post_side_img">
					<img src="images/content/job_post_img1.jpg" alt="post_img" />
				</div>
				<div class="jp_job_post_right_cont jp_job_post_grid_right_cont jp_cl_job_cont">
					<h4>COMERA JOB PORT</h4>
					<p>MARKETING JOB</p>
					<ul>
						<li><i class="fa fa-map-marker"></i>&nbsp; Caliphonia, PO 455001</li>
					</ul>
					<div class="jp_job_post_right_btn_wrapper jp_job_post_grid_right_btn_wrapper jp_cl_aply_btn">
						<ul>
							<li><a href="#">145 ACTIVE JOBS</a></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="jp_job_post_keyword_wrapper">
		<ul>
			<li><i class="fa fa-tags"></i>Keywords :</li>
			<li><a href="#">ui designer,</a></li>
			<li><a href="#">developer,</a></li>
		</ul>
	</div>
</div>
</div>
`


const fetchCompaniesData = () => {
	db.collection("COMPANY").onSnapshot((querySnapshot) => {
		var jobdata = [];
		companyList.innerHTML = ""
		querySnapshot.forEach((doc) => {
			let data = doc.data()
			data.id = doc.id
			jobdata.push(data);
		});
		(jobdata)
		renderCompanies(jobdata)
	});
}

fetchCompaniesData()

const renderCompanies = (data) => {
	if (data.length === 0) {
		companyList.innerHTML = "<h1 class='text-center'>No Results Found!</h1>"
	} else {
		data.forEach((company) => {
			companyList.innerHTML += `<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
<div class="jp_job_post_main_wrapper_cont jp_job_post_grid_main_wrapper_cont">
	<div class="jp_job_post_main_wrapper jp_job_post_grid_main_wrapper">
		<div class="row">
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<div class="jp_job_post_side_img">
					<img style="height: 100px; width: 100px;" src="${company.photoURL}" post_img" />
				</div>
				<div class="jp_job_post_right_cont jp_job_post_grid_right_cont jp_cl_job_cont">
					<h4>${company.company}</h4>
					<p>Phone: ${company.phonenumber}</p>
					<ul>
						<li><i class="fa fa-map-marker"></i>&nbsp; ${company.addressline}</li>
					</ul>
					<div class="jp_job_post_right_btn_wrapper jp_job_post_grid_right_btn_wrapper jp_cl_aply_btn">
						<ul>
							<li><a href="/company_listing_single.html?id=${company.id}">Visit</a></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</div>
`
		})
	}
}

const handleJobClick = (jobID, companyID) => {
	(jobID, companyID)
	let obj = {
		jobID,
		companyID
	}
	window.sessionStorage.setItem('job', JSON.stringify(obj))
	setTimeout(() => {
		window.location.href = "/jobpost/"
	}, 1000);
}