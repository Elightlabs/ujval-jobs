try {
	const db = firebase.firestore()
	function getData() {
		db.collection("BLOGS")
			.onSnapshot((querySnapshot) => {
				var arr = [];
				querySnapshot.forEach((doc) => {
					let obj = doc.data()
					obj.id = doc.id
					arr.push(obj);
				});
				renderBlogs(arr)
			});
	}

	getData()

	const renderBlogs = (blogs) => {
		let elem = document.getElementById('blogs-container')
		elem.innerHTML = ''
		blogs.forEach((blog) => {
			elem.innerHTML += `
			<div class="col-lg-3 col-md-3 col-sm-6 col-xs-12" style='margin: 0 10px; border: 1px solid #333; padding: 10px; border-radius: 10px;'>
<div class="jp_job_post_main_wrapper_cont jp_job_post_grid_main_wrapper_cont">
	<div class="jp_job_post_main_wrapper jp_job_post_grid_main_wrapper">
		<div class="row">
			<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
				<div class="jp_job_post_side_img">
					<img style="height: 100px; aspect-ratio: 16/9; margin: auto;" src="${blog.img}" />
				</div>
				<div class="jp_job_post_right_cont jp_job_post_grid_right_cont jp_cl_job_cont">
					<h4 class='full-overflow'>${blog.blogTitle}</h4>
					<p class='full-overflow'>${blog.blogDesc}</p>
					<div style='display: flex; justify-content: space-between;'>
						<a href='../editblog/index.html?id=${blog.id}' style='border: none; outline: none; cursor: pointer; width: max-content; padding: 4px 10px; background: #44B54F; color: white; border-radius: 6px;'>Edit</a>
						<button onclick='handleDelete("${blog.id}")' style='border: none; outline: none; cursor: pointer; width: max-content; padding: 4px 10px; background: red; color: white; border-radius: 6px;'>Delete</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</div>
`
		})

	}
} catch (error) {

}


const handleDelete = (id) => {
	const db = firebase.firestore()
	let confirmDialogue = window.confirm('Are you confirm to delete this blog?')
	if (confirmDialogue) {
		db.collection("BLOGS").doc(id).delete().then(() => {
			alert('Blog deleted successfully!');
		}).catch(() => {
			alert('Something went wrong!');
		});
	}
}