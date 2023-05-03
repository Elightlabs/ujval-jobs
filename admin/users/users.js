const loadmorebtn = document.getElementById("loadmorebtn")

const db = firebase.firestore()
const user_collection = document.getElementById('user_collection')
let lastDoc = null

const fetchData = () => {
	const user = JSON.parse(window.sessionStorage.getItem("user"))
	db.collection("COMPANY").doc(user.uid).collection("APPLICATIONS").orderBy("firstname")
		.onSnapshot((querySnapshot) => {
			var users = [];
			user_collection.innerHTML = ""
			querySnapshot.forEach((doc, i) => {
				obj = doc.data();
				obj.id = doc.id
				users.push(obj);
			});
			if (users.length === 0) {
				user_collection.innerHTML = "<h1 class='text-center'>No Results Found!</h1>"
			} else {
				users.forEach((user) => {
					user_collection.innerHTML += `
				<a class="col-md-4" href="../profile/?uid=${user.userID}">
								<div class="card user-card">
									<div class="card-header">
										<h5>Profile</h5>
									</div>
									<div class="card-block">
										<div class="user-image">
											<img src='${user.userIMG}' class="img-radius" alt="User-Profile-Image">
										</div>
										<h6 class="f-w-600 m-t-25 m-b-10">${user.firstname} ${user.lastname}</h6>
										<p class="text-muted">Job: ${user.jobTitle} | Date: ${user.date}</p>
										<hr>
									</div>
								</div>
							</a>
				`
				})
			}
		})
}

fetchData()

loadmorebtn.addEventListener('click', () => {
	db.collection("USERS").orderBy("firstname").startAfter(lastDoc || 0).limit(10)
		.onSnapshot((querySnapshot) => {
			var users = [];
			lastDoc = querySnapshot
			querySnapshot.forEach((doc, i) => {
				obj = doc.data();
				obj.id = doc.id
				users.push(obj);
			});
			lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]
			if (users.length === 0) {
				user_collection.innerHTML = "<h1 class='text-center'>No Results Found!</h1>"
				loadmorebtn.style.display = "none"
			} else {
				loadmorebtn.style.display = "block"
				users.forEach((user) => {
					user_collection.innerHTML += `
			<a class="col-md-4" href="../profile/?uid=${user.id}">
							<div class="card user-card">
								<div class="card-header">
									<h5>Profile</h5>
								</div>
								<div class="card-block">
									<div class="user-image">
										<img src='${user.userIMG}' class="img-radius" alt="User-Profile-Image">
									</div>
									<h6 class="f-w-600 m-t-25 m-b-10">${user.firstname} ${user.lastname}</h6>
									<p class="text-muted">Qualification: ${user.qualification} | Experience: ${user.experience} | City: ${user.city}</p>
									<hr>
								</div>
							</div>
						</a>
			`
				})
			}
		})
})