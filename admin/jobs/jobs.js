const jobGridLising = document.getElementById('jobGridLising');
const db = firebase.firestore()
var jobdata = [];
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


const fetchJobData = () => {
	const data = JSON.parse(window.sessionStorage.getItem('user'))
	db.collection("JOBS").where('companyID', "==", data.uid).orderBy("company")
		.get()
		.then((querySnapshot)=> {
			querySnapshot.forEach((doc) => {
				let data = doc.data()
				data.id = doc.id
				jobdata.push(data);
			});
			renderJobData(jobdata)
		});
}

fetchJobData()

const renderJobData = (data) => {
	if (data.length === 0) {
		jobGridLising.innerHTML = "No Results Found"
	} else {
		data.forEach((job) => {
			jobGridLising.innerHTML += `
			<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="height: 300px; min-height: 300px;">
				<div class="jp_job_post_main_wrapper_cont jp_job_post_grid_main_wrapper_cont">
					<div class="jp_job_post_main_wrapper jp_job_post_grid_main_wrapper">
						<div class="row">
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div onclick="handleJobClick('${job.id}', '${job.companyID}')"  class="jp_job_post_side_img">
									<img style="height: 100px; width: 100px;" src="${job.companyIMG}" alt="post_img" />
								</div>
								<div class="jp_job_post_right_cont jp_job_post_grid_right_cont">
									<h4 onclick="handleJobClick('${job.id}', '${job.companyID}')" >${job.jobtitle}</h4>
									<p onclick="handleJobClick('${job.id}', '${job.companyID}')" >${job.company}</p>
									<ul>
										<li><i class="fa fa-cc-paypal"></i>&nbsp; ${job.salary} P.A.</li>
										<li><i class="fa fa-map-marker"></i>&nbsp; ${job.joblocation}</li>
									</ul>
								</div>
							</div>
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div class="jp_job_post_right_btn_wrapper jp_job_post_grid_right_btn_wrapper">
									<ul>
										<li><span class="btn-sm btn btn-success" style="font-size: 14px;">${job.jobtype}</span></li>
										<li><span class="btn-sm btn btn-danger" onclick='deleteJOB("${job.id}")' style="font-size: 14px;">Delete</span></li>
										<li><span class="btn-sm btn btn-success" onclick='editJOB("${job.id}")' style="font-size: 14px;">Edit</span></li>
									</ul>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>`
		})
	}
}


const deleteJOB = (id) => {
	let confirmation = window.confirm('Do You Really Want to delete the job?')
	if (confirmation) {
		db.collection("JOBS").doc(id).delete().then(() => {
			window.alert('Job Deleted Successfully!')
		}).catch((error) => {
			window.alert(error.message)
		});
	}
	else {
		window.alert('Deletion Canceled!')
	}
}
const editJOB = (id) => {
	window.location.href = `../addpost/?id=${id}`
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