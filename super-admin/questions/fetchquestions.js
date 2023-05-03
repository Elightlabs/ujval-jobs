const fetchQuestions = () => {
	const db = firebase.firestore();
	db.collection("QUESTIONS")
		.onSnapshot((querySnapshot) => {
			var arr = [];
			querySnapshot.forEach((doc) => {
				arr.push(doc.data());
			});
			renderQuestions(arr.reverse());
		});
}


const renderQuestions = (questions) => {
	const questionsElem = document.getElementById('questions')
	questionsElem.innerHTML = ""
	questions && questions.forEach((question, i) => {
		questionsElem.innerHTML += `
	<div style="width: 100%; display: flex; justify-content: center; flex-direction: column; background-color: white; border: 1px solid #eee; padding: 20px; margin: 10px;">
							<span style="font-weight: bold; font-size: 18px; color: rgb(204, 204, 204); margin-bottom: 10px;">Q${i + 1}. </span>
							<div><span style="font-weight: bold; width: 100px; margin: 20px 0;">Question:</span> ${question.question}</div>
							<div style="margin-top: 10px;"><span style="font-weight: bold; width: 100px; margin: 20px 0;">User:</span> ${question.name} (${question.email})</div>
						</div>
	`
	})
}

fetchQuestions()