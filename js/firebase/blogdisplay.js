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
		blogs.forEach((blog) => {
			elem.innerHTML += `
			<div style='width: 400px; border: 2px solid black; margin: 0 10px; overflow: hidden;'>
					  <div class="jp_blog_cate_left_main_wrapper">
						<div class="jp_first_blog_post_main_wrapper">
						  <div class="jp_first_blog_post_img">
							<img src="${blog.img}" class="img-responsive" style="width: 500px; aspect-ratio: 16/9;"
							  alt="blog_img" />
						  </div>
						  <div class="jp_first_blog_post_cont_wrapper">
							<ul>
							  <li>
								<div><i class="fa fa-calendar"></i> &nbsp;&nbsp;${blog.date}</div>
							  </li>
							</ul>
							<h3 class='full-overflow'><a href="/blog_single_right.html?id=${blog.id}" class='full-overflow'>${blog.blogTitle.substring(0, 25)}...</a></h3>
							<p class='full-overflow'>
							  ${blog.blogDesc}
							</p>
						  </div>
						</div>
					  </div>
					</div>
			`
		})

	}
} catch (error) {

}

