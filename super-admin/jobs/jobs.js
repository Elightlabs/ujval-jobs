const loadmorebtn = document.getElementById("loadmorebtn")
const params = new URLSearchParams(document.location.search);
const uid = params.get("uid");

const db = firebase.firestore()
const user_collection = document.getElementById('user_collection')
let lastDoc = null

const fetchData = () => {
	var users = [];
	if (uid) {
		db.collection("JOBS").where('companyID', '==', uid).orderBy("company").startAfter(lastDoc || 0).limit(20)
			.onSnapshot((querySnapshot) => {
				lastDoc = querySnapshot
				user_collection.innerHTML = ""
				querySnapshot.forEach((doc, i) => {
					obj = doc.data();
					obj.id = doc.id
					users.push(obj);
				})
				renderResult(users)
				lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]
			})
	}
	else {
		db.collection("JOBS").orderBy("company").startAfter(lastDoc || 0).limit(20)
			.onSnapshot((querySnapshot) => {
				lastDoc = querySnapshot
				user_collection.innerHTML = ""
				querySnapshot.forEach((doc, i) => {
					obj = doc.data();
					obj.id = doc.id
					users.push(obj);
				})
				lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]
				renderResult(users)
			})
	}

}


const renderResult = (users) => {
	users.forEach((user) => {
		user_collection.innerHTML += `
			<a class="col-md-4" href="../jobpost/?uid=${user.id}">
							<div class="card user-card">
								<div class="card-header">
									<h5>Profile</h5>
								</div>
								<div class="card-block">
									<div class="user-image">
										<img src='${user.companyIMG}' class="img-radius" alt="User-Profile-Image">
									</div>
									<h6 class="f-w-600 m-t-25 m-b-10">${user.company}</h6>
									<p class="text-muted">Qualification: ${user.qualification} | Experience: ${user.experience} | Type: ${user.jobtype}</p>
									<hr>
								</div>
							</div>
						</a>
			`
	})
}

fetchData()

loadmorebtn.addEventListener('click', () => {
	db.collection("JOBS").where('companyID', '==', uid).orderBy("company").startAfter(lastDoc || 0).limit(20)
		.onSnapshot((querySnapshot) => {
			var users = [];
			lastDoc = querySnapshot
			querySnapshot.forEach((doc, i) => {
				obj = doc.data();
				obj.id = doc.id
				users.push(obj);
			});
			lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]
			users.forEach((user) => {
				user_collection.innerHTML += `
			<a class="col-md-4" href="../jobpost/?uid=${user.id}">
							<div class="card user-card">
								<div class="card-header">
									<h5>Profile</h5>
								</div>
								<div class="card-block">
									<div class="user-image">
										<img src='${user.photoURL}' class="img-radius" alt="User-Profile-Image">
									</div>
									<h6 class="f-w-600 m-t-25 m-b-10">${user.firstname} ${user.lastname}</h6>
									<p class="text-muted">Qualification: ${user.qualification} | Experience: ${user.experience} | City: ${user.city}</p>
									<hr>
								</div>
							</div>
						</a>
			`
			})
		})
})