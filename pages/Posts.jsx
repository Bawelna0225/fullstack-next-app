import React from 'react'
import styles from '@/styles/Home.module.css'
import Link from 'next/link'
import { VscComment } from 'react-icons/vsc'
const Posts = ({ posts }) => {
	const getUsableDate = (dateStr) => {
		const dateObj = new Date(dateStr)
		const options = { year: 'numeric', month: 'long', day: 'numeric' }
		const formattedDate = new Intl.DateTimeFormat('en-us', options).format(dateObj)
		return formattedDate
	}
	return (
		<>
			<main className="posts-container">
				<div>
					<div className="cards-grid">
						{posts.map((item) => (
							<div className="card" key={item.post_id}>
								<h3>{item.title}</h3>
								<p>{item.content}</p>
								<p className="comments-count">
									<VscComment></VscComment>
									<span>69</span>
								</p>
								<Link href="#">
									<span>Read More</span>
								</Link>
								<div className="bottom">
									<small>{getUsableDate(item.date_created)}</small>
									<p>By: Author</p>
								</div>
							</div>
						))}
					</div>
				</div>
			</main>
		</>
	)
}

export default Posts
