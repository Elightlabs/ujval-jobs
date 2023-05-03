const loadmorebtn = document.getElementById("loadmorebtn")

const db = firebase.firestore()
const company_collection = document.getElementById('company_collection')
let lastDoc = null
var company = [];

const fetchData = () => {
	db.collection("COMPANY").orderBy("username")
		.onSnapshot((querySnapshot) => {
			company_collection.innerHTML = ""
			querySnapshot.forEach((doc, i) => {
				obj = doc.data();
				obj.id = doc.id
				if (!obj.subscription) {
					obj.subscription = 'Trial'
				}
				company.push(obj);
			});
			renderData(company)
		})
}

const renderData = (company) => {
	company_collection.innerHTML = ""
	if (company.length === 0) {
		company_collection.innerHTML = "<h1 style='text-align: center;'>No results found!</h1>"
	}
	else {
		company.forEach((user) => {
			let text = 'Disable'
			if (user.disabled === true) {
				text = 'Enable'
			}
			else {
				text = 'Disable'
			}
			company_collection.innerHTML += `
		<div class="col-md-4">
						<div class="card user-card">
							<div class="card-header">
							<h5 style="border-radius: 10px; padding: 5px 8px; background-color: rgba(243, 105, 105, 0.7);">Plan: ${user.subscription || 'Trial'}</h5>
							</div>
							<div class="card-block">
								<div class="user-image">
									<img src='${user.photoURL}' class="img-radius" alt="User-Profile-Image">
								</div>
								<a  href="../company-details/?uid=${user.id}"><h6 class="f-w-600 m-t-25 m-b-10">${user.company}</h6></a>
								<p class="text-muted">Username: ${user.username} | Phone: ${user.phonenumber} | Email: ${user.email}</p>
								<hr>
								<button class='btn-sm btn-primary' onclick='handleDisable("${user.id}")'>${text}</button>
								<button type='button' class='btn-sm btn-danger' onclick='handleCompanyDelete("${user.id}", "${user.disabled}")'>Delete</button>
							</div>
						</div>
					</div>
		`
		})
	}
}

const handleCompanyDelete = async (id) => {
	let confirmModal = window.confirm('Are you sure you want to delete the company?')
	if (confirmModal) {
		db.collection("COMPANY").doc(id).delete().then(() => {
			alert('Deleted Successfully!')
		}).catch((error) => {
			alert(error.message)
		});
	}
}
fetchData()

const handleDisable = (id, state) => {
	state = Boolean(state)
	var docRef = db.collection("COMPANY").doc(id);
	if (state) {
		docRef.update({
			disabled: false
		})
			.then(() => {
				alert("Document successfully updated!");
			})
			.catch((error) => {
				alert("Error updating document: ", error);
			});
	}
	else {
		docRef.update({
			disabled: true
		})
			.then(() => {
				alert("Document successfully updated!");
			})
			.catch((error) => {
				alert("Error updating document: ", error);
			});
	}
}




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
		let result = company.filter((item) => {
			return filterArray.includes(item.subscription)
		})
		filterArray.length === 0 ? renderData(company) : renderData(result)
	})
})