import React from 'react'
import styles from '@/styles/Home.module.css'
const Posts = ({ posts }) => {
	const getUsableDate = (dateStr) => {
		const dateObj = new Date(dateStr)
		const options = { year: 'numeric', month: 'long', day: 'numeric' }
		const formattedDate = new Intl.DateTimeFormat('en-us', options).format(dateObj)
		return formattedDate
	}
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
								<small>{getUsableDate(item.date_created)}</small>
							</div>
						))}
					</div>
				</div>
			</main>
		</>
	)
}

export default Posts
