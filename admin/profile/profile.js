const params = new URLSearchParams(document.location.search);
const uid = params.get("uid");
const db = firebase.firestore()
const profileURL = document.getElementById('profileURL');
const qualification = document.getElementById('qualification');
const experience = document.getElementById('experience');
const fullname = document.getElementById('fullname');
const email = document.getElementById('email');
const phone = document.getElementById('phone');
const portfolio = document.getElementById('portfolio');
const address = document.getElementById('address');
const cv = document.getElementById('cv');


db.collection("USERS").doc(uid)
    .onSnapshot((doc) => {
        ("Current data: ", doc.data());
		profileURL.src = doc.data().photoURL;
		fullname.innerHTML = `${doc.data().firstname} ${doc.data().lastname}`
		email.innerHTML = `${doc.data().email}`
		phone.innerHTML = `${doc.data().phonenumber}`
		portfolio.innerHTML = `${doc.data().portfolio}`
		address.innerHTML = `${doc.data().city} ${doc.data().zipcode}`
		experience.innerHTML = `Experience: ${doc.data().experience}`
		qualification.innerHTML = `Qualification: ${doc.data().qualification}`
		cv.href = doc.data().cvURL
    });
