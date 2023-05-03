const handleSubmitQuestion = () => {
	const name = document.getElementById('name');
	const email = document.getElementById('email');
	const question = document.getElementById('question');
	const db = firebase.firestore()
	if (question.value.length >= 3 || name.value.length === 0 || email.value.length >= 3) {
		const date = new Date()
		db.collection("QUESTIONS").add({
			name: name.value,
			email: email.value,
			question: question.value,
			date: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
		})
			.then((docRef) => {
				alert('Question posted successfully, We will get back to you soon!')
				name.value = ""
				email.value = ""
				question.value = ""
			})
			.catch((error) => {
				console.error("Error adding document: ", error);
			});

	} else {
		alert('Fill the form properly')
	}
}