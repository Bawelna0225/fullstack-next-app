import React from 'react'
import styles from '@/styles/Home.module.css'
const Posts = ({ posts }) => {
	return (
		<>
			<main className={styles.main}>
				<div>
					<h2>My data from MySQL:</h2>
					<div className={styles.grid}>
						{posts.map((item) => (
							<div className={styles.card} key={item.post_id}>
								<h3>{item.title}</h3>
								<p>{item.content}</p>
								<button>Read More</button>
								<small>{item.date_created}</small>
							</div>
						))}
					</div>
				</div>
			</main>
		</>
	)
}

export default Posts
