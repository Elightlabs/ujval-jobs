const jobGridLising = document.getElementById('jobGridLising');
const loadMoreJobs = document.getElementById('loadMoreJobs');
let lastDoc = null
const db = firebase.firestore()
var jobdata = [];
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id') || undefined;

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
	if (id) {
		db.collection("JOBS").where('companyID', '==', id).orderBy("company").startAfter(lastDoc || 0).limit(20)
			.get()
			.then((querySnapshot) => {
				jobGridLising.innerHTML = ""
				querySnapshot.forEach((doc) => {
					let data = doc.data()
					data.id = doc.id
					jobdata.push(data);
				});
				lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]
				renderJobData(jobdata)
			});
	} else {
		db.collection("JOBS").orderBy("company").startAfter(lastDoc || 0).limit(20)
			.get()
			.then((querySnapshot) => {
				jobGridLising.innerHTML = ""
				querySnapshot.forEach((doc) => {
					let data = doc.data()
					data.id = doc.id
					jobdata.push(data);
				});
				lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]
				renderJobData(jobdata)
			});
	}
}

fetchJobData()
const renderJobData = (data) => {
	jobGridLising.innerHTML = ""
	if (data.length === 0) {
		jobGridLising.innerHTML = `<h1 style="text-align: center; margin-top: 2rem;">No Results Found!</h1>`
		loadMoreJobs.style.display = "none"
	}
	else {
		try {
			loadMoreJobs.style.display = "block"
		} catch (error) {

		}
		data.forEach((job) => {
			jobGridLising.innerHTML += `
			<div class="col-lg-6 col-md-6 col-sm-6 col-xs-12" style="height: 300px; min-height: 300px;">
				<div class="jp_job_post_main_wrapper_cont jp_job_post_grid_main_wrapper_cont">
					<div class="jp_job_post_main_wrapper jp_job_post_grid_main_wrapper">
						<div class="row">
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div class="jp_job_post_side_img">
									<img style="height: 100px; width: 100px;" src="${job.companyIMG}" alt="post_img" />
								</div>
								<div class="jp_job_post_right_cont jp_job_post_grid_right_cont">
									<h4>${job.jobtitle}</h4>
									<p>${job.company}</p>
									<ul>
										<li><i class="fa fa-cc-paypal"></i>&nbsp; ${job.salary} P.A.</li>
										<li><i class="fa fa-map-marker"></i>&nbsp; ${job.joblocation}</li>
									</ul>
								</div>
							</div>
							<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
								<div class="jp_job_post_right_btn_wrapper jp_job_post_grid_right_btn_wrapper">
									<ul>
										<li><span class="btn btn-success" style="font-size: 14px;">${job.jobtype}</span></li>
										<li><button class="btn btn-primary" style="font-size: 14px;" onclick="handleClick('${job.id}', '${job.companyID}')">View</button></li>
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

try {
	loadMoreJobs.addEventListener('click', () => {
		if (id) {
			db.collection("JOBS").where('companyID', '==', id).orderBy("company").startAfter(lastDoc || 0).limit(20)
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						let data = doc.data()
						data.id = doc.id
						jobdata.push(data);
					});
					lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]
					renderJobData(jobdata)
				})
		}
		else {
			db.collection("JOBS").orderBy("company").startAfter(lastDoc || 0).limit(20)
				.get()
				.then((querySnapshot) => {
					querySnapshot.forEach((doc) => {
						let data = doc.data()
						data.id = doc.id
						jobdata.push(data);
					});
					lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]
					renderJobData(jobdata)
				});
		}
	})
	const jobcategory = document.getElementById('jobcategory')
} catch (error) {

}

const handleClick = (jobID, companyID) => {
	let obj = {
		jobID,
		companyID
	}
	window.sessionStorage.setItem('job', JSON.stringify(obj))
	setTimeout(() => {
		window.location.href = "listing_single.html"
	}, 1000);
}


let jobFilter = []
const educationInputs = document.querySelectorAll('input[type="checkbox"]')
const radioInput = document.querySelectorAll('input[type="radio"]')
educationInputs.forEach((input) => {
	input.addEventListener('change', (e) => {
		if (e.target.checked) {
			let filterSet = new Set(jobFilter)
			filterSet.add(e.target.getAttribute('filter'))
			jobFilter = [...filterSet]
		} else {
			let filterSet = new Set(jobFilter)
			filterSet.delete(e.target.getAttribute('filter'))
			jobFilter = [...filterSet]
		}
		let result = jobdata.filter((item) => {
			return jobFilter.includes(item.jobcategory) || jobFilter.includes(item.salary) || jobFilter.includes(item.gender) || jobFilter.includes(item.jobsector) || jobFilter.includes(item.jobtype)
		})
		jobFilter.length === 0 ? renderJobData(jobdata) : renderJobData(result)
	})
})
radioInput.forEach((input) => {
	input.addEventListener('change', (e) => {
		if (e.target.checked || e.target.value) {
			let filterSet = new Set(jobFilter)
			filterSet.add(e.target.getAttribute('filter') || e.target.value)
			jobFilter = [...filterSet]
		} else {
			let filterSet = new Set(jobFilter)
			filterSet.delete(e.target.getAttribute('filter') || e.target.value)
			jobFilter = [...filterSet]
		}
		let result = jobdata.filter((item) => {
			return jobFilter.includes(item.jobcategory) || jobFilter.includes(item.salary) || jobFilter.includes(item.gender) || jobFilter.includes(item.jobsector) || jobFilter.includes(item.jobtype)
		})
		jobFilter.length === 0 ? renderJobData(jobdata) : renderJobData(result)
	})
})

let flag = true
const handleMoreFilter = () => {
	const MoreFilters = document.getElementById('MoreFilters');
	const viewMore = document.getElementById('viewMore');
	if (flag) {
		MoreFilters.style.display = 'block';
		viewMore.innerHTML = "Hide"
		flag = false
	}
	else {
		MoreFilters.style.display = 'none';
		viewMore.innerHTML = "View More"
		flag = true
	}
}

try {
    let cityJSON = JSON.parse('["Choose City", "Mumbai","Pune","Nagpur","Nashik","Vasai-Virar","Aurangabad","Solapur","Bhiwandi","Amravati","Malegaon","Kolhapur","Nanded","Sangli","Jalgaon","Akola","Latur","Ahmadnagar","Dhule","Ichalkaranji","Chandrapur","Parbhani","Jalna","Bhusawal","Navi Mumbai","Panvel","Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh","Uttarakhand","West Bengal"]')
    cityJSON.forEach((city) => {
	document.getElementById('joblocation').innerHTML += `<option value='${city}'>${city}</option>`
})
}
catch(err){
}

if (window.localStorage.getItem('filter')) {
	document.querySelector(`input[filter='${window.localStorage.getItem('filter')}']`).checked = true;
	window.localStorage.removeItem('filter')
}