import React, { useState } from 'react'
import Link from 'next/link'
import { VscComment } from 'react-icons/vsc'
const Posts = ({ posts, commentsQuantity, authors }) => {
	const [isLoading, setIsLoading] = useState(false)
	const getUsableDate = (dateStr) => {
		const dateObj = new Date(dateStr)
		const options = { year: 'numeric', month: 'long', day: 'numeric' }
		const formattedDate = new Intl.DateTimeFormat('en-us', options).format(dateObj)
		return formattedDate
	}
	return (
		<>
			{isLoading && (
				<div className="loader">
					<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 38 38">
						<defs>
							<linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
								<stop stop-color="#fff" stop-opacity="0" offset="0%" />
								<stop stop-color="#fff" stop-opacity=".631" offset="63.146%" />
								<stop stop-color="#fff" offset="100%" />
							</linearGradient>
						</defs>
						<g fill="none" fill-rule="evenodd">
							<g transform="translate(1 1)">
								<path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" stroke-width="2">
									<animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite" />
								</path>
								<circle fill="#fff" cx="36" cy="18" r="1">
									<animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite" />
								</circle>
							</g>
						</g>
					</svg>
				</div>
			)}
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
								<Link href={`/posts/${item.post_id}`} onClick={() => setIsLoading(true)}>
									<span>Read More</span>
								</Link>
								<div className="bottom">
									<small>{getUsableDate(item.date_created)}</small>
									{authors.map((author) => {
										if (author.id === item.author_id) return <p key={author.id}>By: {author.name}</p>
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
