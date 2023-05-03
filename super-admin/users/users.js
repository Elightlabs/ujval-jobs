const loadmorebtn = document.getElementById("loadmorebtn")

const db = firebase.firestore()
const user_collection = document.getElementById('user_collection')
let lastDoc = null
let users = []

const fetchData = () => {
	db.collection("USERS").orderBy("firstname")
		.onSnapshot((querySnapshot) => {
			lastDoc = querySnapshot
			user_collection.innerHTML = ""
			querySnapshot.forEach((doc, i) => {
				obj = doc.data();
				obj.id = doc.id
				if (obj.plan) {
					users.push(obj);
				} else {
					obj.plan = "Free"
					users.push(obj);
				}
			});
			renderData(users)
		})
}

fetchData()


const renderData = (users) => {
	user_collection.innerHTML = ""
	if (users.length === 0) {
		user_collection.innerHTML = '<h1 style="text-align: center;">No results found!</h1>'
	} else {
		users.forEach((user) => {
			user_collection.innerHTML += `
			<div class="col-md-4">
							<div class="card user-card">
								<div class="card-header">
									<h5 style="border-radius: 10px; padding: 5px 8px; background-color: rgba(243, 105, 105, 0.7);">Plan: ${user.plan || 'Free'}</h5>
								</div>
								<div class="card-block">
									<a  href="../profile/?uid=${user.id}" class="user-image">
										<img src='${user.photoURL}' class="img-radius" alt="User-Profile-Image">
									</a>
									<h6 class="f-w-600 m-t-25 m-b-10">${user.firstname} ${user.lastname}</h6>
									<p class="text-muted">Qualification: ${user.qualification} | Experience: ${user.experience} | City: ${user.city}</p>
									<span><button onclick="handleUserDelete('${user.id}')" class="btn-sm btn btn-success" style="font-size: 14px;">Delete</button></span>
									<hr>
								</div>
							</div>
						</a>
			`
		})
	}
}

const handleUserDelete = (uid) => {
	const db = firebase.firestore()
	const confirmDia = window.confirm('Are you sure you want to delete the user?');
	if (confirmDia) {
		db.collection("USERS").doc(uid).delete().then(() => {
			alert("Document successfully deleted!");
		}).catch((error) => {
			console.error("Error removing document: ", error);
		});
	}

}

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
			users.forEach((user) => {
				user_collection.innerHTML += `
			<a class="col-md-4" href="../profile/?uid=${user.id}">
							<div class="card user-card">
								<div class="card-header">
								<h5>Plan: ${user.plan ? plan : 'Free'}</h5>
								</div>
								<div class="card-block">
									<div class="user-image">
										<img src='${user.photoURL}' class="img-radius" alt="User-Profile-Image">
									</div>
									<h6 class="f-w-600 m-t-25 m-b-10">${user.firstname} ${user.lastname}</h6>
									<p class="text-muted">Qualification: ${user.qualification} | Experience: ${user.experience} | City: ${user.city}</p>
									<span><button onclick="handleUserDelete('${user.id}')" class="btn-sm btn btn-success" style="font-size: 14px;">Delete</button></span>
									<hr>
								</div>
							</div>
						</a>
			`
			})
		})
})


let filterArray = [];

const filterInp = document.getElementsByName("cb")
filterInp.forEach((input) => {
	input.addEventListener('change', (e) => {
		if (e.target.checked) {
			let filterSet = new Set(filterArray)
			filterSet.add(e.target.getAttribute('filter'))
			filterArray = [...filterSet]
		} else {
			let filterSet = new Set(filterArray)
			filterSet.delete(e.target.getAttribute('filter'))
			filterArray = [...filterSet]
		}
		let result = users.filter((item) => {
			return filterArray.includes(item.plan)
		})
		filterArray.length === 0 ? renderData(users) : renderData(result)
	})
})