import React from 'react'
import Link from 'next/link'
import { VscComment } from 'react-icons/vsc'
const Posts = ({ posts, commentsQuantity, authors }) => {

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
									<span>{commentsQuantity.filter((comment) => comment.post_id === item.post_id).length}</span>
								</p>
								<Link href={`/posts/${item.post_id}`}>
									<span>Read More</span>
								</Link>
								<div className="bottom">
									<small>{getUsableDate(item.date_created)}</small>
									{authors.map((author) => {
										if(author.id === item.author_id) return <p key={author.id}>By: {author.name}</p>
									})}
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
