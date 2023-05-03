try {
	const elements = document.querySelectorAll('input[type="radio"]')

	elements.forEach((element) => {
		element.addEventListener('change', (e) => {
			if (e.target.checked) {
				window.localStorage.setItem('filter', e.target.getAttribute('filter'))
				window.location.href = '/listing_right.html'
			}
		})
	})
} catch (error) {

}