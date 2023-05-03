const db = firebase.firestore();

const addblogbtn = document.getElementById('addBlogButton');

const getDate = () => {
	const dateOBJ = new Date();
	let date = dateOBJ.getDate()
	if (date <= 9) {
		date = `0${date}`
	}
	let month = dateOBJ.getMonth() + 1
	if (month <= 9) {
		month = `0${month}`
	}
	let year = dateOBJ.getFullYear()
	let dateString = `${date}-${month}-${year}`
	return dateString
}


const addBlog = () => {
	const blogTitle = document.getElementById('blog_title').value
	const blogDesc = document.getElementById('blog_desc').value
	const file = document.getElementById('blog_img').files[0]

	const data = {
		blogTitle,
		blogDesc,
		date: getDate(),
	}
	db.collection("BLOGS").add(data).then((docRef) => {
		var storageRef = firebase.storage().ref();
		var uploadTask = storageRef.child(`blogs/${docRef.id}.jpg`).put(file);
		uploadTask.on('state_changed',
			(snapshot) => {
				var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
				switch (snapshot.state) {
					case firebase.storage.TaskState.PAUSED: // or 'paused'
						break;
					case firebase.storage.TaskState.RUNNING: // or 'running'
						break;
				}
			},
			(error) => {
				// Handle unsuccessful uploads
			},
			() => {
				uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
					var documentRef = db.collection("BLOGS").doc(`${docRef.id}`);
					documentRef.update({
						img: downloadURL
					})
						.then(() => {
							window.alert('Blog Posted Successfully!')
						})
						.catch((error) => {
							// The document probably doesn't exist.
							console.error("Error updating document: ", error);
						});
				});
			}
		);
	})
		.catch((error) => {
		})
}

addblogbtn.addEventListener("click", (e) => {
	e.preventDefault()
	addBlog()
})