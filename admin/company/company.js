const profileURL = document.getElementById('profileURL')
const leftName = document.getElementById('leftName')
const companyName = document.getElementById('companyName')
const email = document.getElementById('email')
const phone = document.getElementById('phone')
const website = document.getElementById('website')
const address = document.getElementById('address')
const saveBtn = document.getElementById('saveBtn')
let flag = false
const db = firebase.firestore()

const company = JSON.parse(window.sessionStorage.getItem('user'));
profileURL.src = company.photoURL
leftName.innerHTML = company.company
companyName.innerHTML = company.company
email.innerHTML = company.email
phone.innerHTML = company.phonenumber
website.innerHTML = company.website
address.innerHTML = company.addressline
subscription.innerHTML = company.subscription

const handleEdit = () => {
	if (!flag) {
		companyName.contentEditable = true
		phone.contentEditable = true
		website.contentEditable = true
		address.contentEditable = true
		saveBtn.style.display = "block"
		companyName.focus()
	}
	else {
		companyName.contentEditable = false
		phone.contentEditable = false
		website.contentEditable = false
		address.contentEditable = false
		saveBtn.style.display = "none"
	}
}

const handleSave = () => {
	var docRef = db.collection("COMPANY").doc(company.id);
	docRef.update({
		company: companyName.innerHTML,
		phonenumber: phone.innerHTML,
		website: website.innerHTML,
		addressline: address.innerHTML
	})
		.then(() => {
			companyName.contentEditable = false
			phone.contentEditable = false
			website.contentEditable = false
			address.contentEditable = false
			saveBtn.style.display = "none"

			var docRef = db.collection("COMPANY").doc(company.id);
			docRef.get().then((doc) => {
				if (doc.exists) {
					let obj = doc.data();
					obj.id = doc.id
					window.sessionStorage.setItem('user', JSON.stringify(obj))
					const company = JSON.parse(window.sessionStorage.getItem('user'));
					profileURL.src = company.photoURL
					leftName.innerHTML = company.company
					companyName.innerHTML = company.company
					email.innerHTML = company.email
					phone.innerHTML = company.phonenumber
					website.innerHTML = company.website
					address.innerHTML = company.addressline
					subscription.innerHTML = company.subscription
					alert("Details Updated")
				} else {
				}
			}).catch((error) => {
			});

		})
		.catch((error) => {
			// The document probably doesn't exist.
			console.error("Error updating document: ", error);
		});


}