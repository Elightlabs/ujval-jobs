const searchURL = window.location.search;
let urlSearchParams = new URLSearchParams(searchURL)
let id = urlSearchParams.get('id')


const getDataEdit = () => {
	const db = firebase.firestore()
	var docRef = db.collection("BLOGS").doc(id);
	docRef.get().then((doc) => {
		if (doc.exists) {
			document.getElementById('blog_title').value = doc.data().blogTitle
			document.getElementById('blog_desc').value = doc.data().blogDesc
		} else {
		}
	}).catch((error) => {
	});

}
getDataEdit()



const editBlogFunc = () => {
	var docRef = db.collection("BLOGS").doc(id);
	docRef.update({
		blogTitle: document.getElementById('blog_title').value,
		blogDesc: document.getElementById('blog_desc').value
	})
		.then(() => {
			alert("Document successfully updated!");
		})
		.catch((error) => {
			alert("Error updating document: ", error);
		});

}