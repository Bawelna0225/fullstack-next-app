import React, { useState, useEffect } from 'react'
import connection from '../../utils/db'
import Navbar from '@/components/Navbar'
import Comments from '@/components/Comments'
import { useSession } from 'next-auth/react'

export default function Post({ posts, users, id }) {
	const { status, data } = useSession()
	const [commentContent, setCommentContent] = useState('')
	const [comments, setComments] = useState([])

	const getUsableDate = (dateStr) => {
		const dateObj = new Date(dateStr)
		const options = { year: 'numeric', month: 'long', day: 'numeric' }
		const formattedDate = new Intl.DateTimeFormat('en-us', options).format(dateObj)
		return formattedDate
	}
	function resetForm() {
		setCommentContent('')
	}
	async function fetchAndSetComments() {
		const response = await fetch('/api/comments', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(id),
		})
		const comments = await response.json()
		setComments(comments.selectComments)
	}
	fetchAndSetComments()

	useEffect(() => {
		const intervalId = setInterval(fetchAndSetComments, 5000) // Poll every 5 seconds

		return () => clearInterval(intervalId)
	}, [])

	const handleSubmitComment = async (e) => {
		const email = data.user.email
		e.preventDefault()
		resetForm()
		const response = await fetch('/api/save-comment', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id, commentContent, email }),
		})
		const info = await response.json()
		if (response.ok) {
			fetchAndSetComments()
		} else {
			console.error('Error', info)
		}
		console.log(info)
	}
	const handleGrandchildSubmit = () => {
		fetchAndSetComments()
	}
	const user = users.filter((author) => author.email === data?.user.email)
	const postAuthor = users.filter((author) => author.id === posts[0].author_id)
	return (
		<>
			<div className="custom-shape-divider-bottom-1677324005">
				<svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
					<path
						d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
						opacity=".25"
						className="shape-fill"
					></path>
					<path
						d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
						opacity=".5"
						className="shape-fill"
					></path>
					<path
						d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
						className="shape-fill"
					></path>
				</svg>
			</div>
			<Navbar userData={user} />
			<div className="post-container">
				<div className="top">
					<p>
						Created: <span>{getUsableDate(posts[0].date_created)}</span>
					</p>
					<p>
						By: <span>{postAuthor[0].name}</span>
					</p>
				</div>
				<div className="post-content">
					<h1>{posts[0].title}</h1>
					<pre>{posts[0].content}</pre>
				</div>
				<div className="comments">
					<h2>Leave Your Comment</h2>
					<form onSubmit={handleSubmitComment}>
						<textarea placeholder="Your thoughts ..." required value={commentContent} onChange={({ target }) => setCommentContent(target.value)}></textarea>
						<div className="buttons">
							<button type="reset" onClick={() => setCommentContent('')}>
								<span>
									Cancel
									<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
										<path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855a.75.75 0 0 0-.124 1.329l4.995 3.178 1.531 2.406a.5.5 0 0 0 .844-.536L6.637 10.07l7.494-7.494-1.895 4.738a.5.5 0 1 0 .928.372l2.8-7Zm-2.54 1.183L5.93 9.363 1.591 6.602l11.833-4.733Z"></path>
										<path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-4.854-1.354a.5.5 0 0 0 0 .708l.647.646-.647.646a.5.5 0 0 0 .708.708l.646-.647.646.647a.5.5 0 0 0 .708-.708l-.647-.646.647-.646a.5.5 0 0 0-.708-.708l-.646.647-.646-.647a.5.5 0 0 0-.708 0Z"></path>
									</svg>
								</span>
							</button>
							<button type="submit" disabled={status === 'unauthenticated'}>
								<span>
									Submit
									<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
										<path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"></path>
									</svg>
								</span>
							</button>
						</div>
					</form>
					<Comments onGrandchildSubmit={handleGrandchildSubmit} comments={comments} users={users} id={id} />
				</div>
			</div>
		</>
	)
}
export const getStaticPaths = async () => {
	const [usersPosts] = await connection.promise().query('SELECT * FROM userposts ORDER BY post_id desc')
	const posts = JSON.parse(JSON.stringify(usersPosts))

	const paths = posts.map((post) => {
		return {
			params: {
				id: post.post_id.toString(),
			},
		}
	})
	return {
		paths,
		fallback: false,
	}
}
export const getStaticProps = async (context) => {
	const id = context.params.id
	const [usersPosts] = await connection.promise().query(`SELECT * FROM userposts WHERE post_id = ${id}`)
	const [selectUsers] = await connection.promise().query(`SELECT * FROM userdata`)

	const posts = JSON.parse(JSON.stringify(usersPosts))
	const users = JSON.parse(JSON.stringify(selectUsers))
	return {
		props: {
			posts,
			users,
			id,
		},
	}
}
