const userListGrid = document.getElementById('userListGrid');
let lastDoc = null
const db = firebase.firestore()
const urlParams = new URLSearchParams(window.location.search);
const jobID = urlParams.get('jobId');

const template = ` <div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
<div class="jp_job_post_main_wrapper_cont jp_job_post_grid_main_wrapper_cont">
	<div class="jp_job_post_main_wrapper jp_job_post_grid_main_wrapper">
		<div class="row">
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<div class="jp_job_post_side_img">
					<img src="images/content/job_post_img1.jpg" alt="post_img" />
				</div>
				<div class="jp_job_post_right_cont jp_job_post_grid_right_cont">
					<h4>HTML Developer (1 - 2 Yrs Exp.)</h4>
					<p>Webstrot Technology Pvt. Ltd.</p>
					<ul>
						<li><i class="fa fa-cc-paypal"></i>&nbsp; $12K - 15k P.A.</li>
						<li><i class="fa fa-map-marker"></i>&nbsp; Caliphonia, PO 455001</li>
					</ul>
				</div>
			</div>
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<div class="jp_job_post_right_btn_wrapper jp_job_post_grid_right_btn_wrapper">
					<ul>
						<li><a href="#">Part Time</a></li>
						<li><a href="#">Apply</a></li>
					</ul>
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
</div>`


const fetchApplicantData = () => {
	const jobData = JSON.parse(window.sessionStorage.getItem("job"))
	db.collection("COMPANY").doc(`${jobData.companyID}`).collection("APPLICATIONS").where(`jobID`, "==", `${jobData.jobID}`)
		.onSnapshot((querySnapshot) => {
			var jobdata = [];
			userListGrid.innerHTML = ""
			querySnapshot.forEach((doc) => {
				let data = doc.data()
				data.id = doc.id
				jobdata.push(data);
			});
			(jobdata)
			lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]
			renderApplicationData(jobdata)
		});
}

fetchApplicantData()

const renderApplicationData = (data) => {
	if (data.length === 0) {
		userListGrid.innerHTML = "<h1 class='text-center'>No Results Found!</h1>"
	}else{
	data.forEach((user) => {
		userListGrid.innerHTML += `
		<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12">
			<div class="jp_job_post_main_wrapper_cont jp_job_post_grid_main_wrapper_cont">
				<div class="jp_job_post_main_wrapper jp_job_post_grid_main_wrapper">
					<div class="row">
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<div class="jp_job_post_side_img">
								<img style="height: 100px; width: 100px;" src="${user.userIMG}" alt="post_img" />
							</div>
							<div class="jp_job_post_right_cont jp_job_post_grid_right_cont">
								<h4>${user.firstname} ${user.lastname}</h4>
								<p>${user.jobTitle}</p>
								<ul>
									<li>Email: ${user.userEmail}</li>
									<li>Date: ${user.date}</li>
								</ul>
							</div>
						</div>
						<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
							<div class="jp_job_post_right_btn_wrapper jp_job_post_grid_right_btn_wrapper">
									<span><a href="../profile/?uid=${user.userID}" class="btn-sm btn btn-success" style="font-size: 14px;">View</a></span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>`
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
		window.location.href = "../jobpost/"
	}, 1000);
}