const params = new URLSearchParams(document.location.search);
const uid = params.get("uid");
const db = firebase.firestore()
const profileURL = document.getElementById('profileURL');
const companyName = document.getElementById('companyName');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const website = document.getElementById('website');
const address = document.getElementById('address');
const addressline = document.getElementById('addressline');
const leftName = document.getElementById('leftName');
const description = document.getElementById('description');
const visit = document.getElementById('visit');


db.collection("COMPANY").doc(uid)
    .onSnapshot((doc) => {
		profileURL.src = doc.data().photoURL;
		companyName.innerHTML = `${doc.data().company}`
		leftName.innerHTML = `${doc.data().company}`
		visit.href = `../jobs/?uid=${uid}`
		email.innerHTML = `${doc.data().email}`
		phone.innerHTML = `${doc.data().phonenumber}`
		website.innerHTML = `${doc.data().website}`
		website.href = `${doc.data().website}`
		address.innerHTML = `${doc.data().addressline}`
		addressline.innerHTML = `${doc.data().addressline}`
		experience.innerHTML = `Experience: ${doc.data().experience}`
		description.innerText = doc.data().description
    });
