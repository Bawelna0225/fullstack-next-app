import { useEffect, useState } from 'react'
import { VscComment } from 'react-icons/vsc'
import connection from '../utils/db'
import { useSession } from 'next-auth/react'
import Router from 'next/router'
import Navbar from '@/components/Navbar'
import { AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai'

const Home = ({ posts, commentsQuantity, authors }) => {
	const [deleteID, setDeleteID] = useState(null)
	const [showModal, setShowModal] = useState(false)
	const { status, data } = useSession()

	useEffect(() => {
		if (status === 'unauthenticated') Router.replace('/auth/signin')
	}, [status])

	if (status === 'authenticated') {
		const handleEdit = async (e) => {
			const postID = e.target.getAttribute('data-post-id')
			const postTitle = e.target.getAttribute('data-post-title')
			const postContent = e.target.getAttribute('data-post-content')
			console.table([
				['postID', postID],
				['postTitle', postTitle],
				['postContent', postContent],
			])
			Router.push({
				pathname: '/edit-post',
				query: { postID, postTitle, postContent },
			})
		}
		const confirmDelete = async (e) => {
			const postID = e.target.getAttribute('data-post-id')
			setShowModal(true)
			setDeleteID(postID)
		}
		const handleDelete = async (postID) => {
			console.log('deleting:', postID)
			// const response = await fetch('/api/delete_post', {
			// 	method: 'POST',
			// 	headers: {
			// 		'Content-Type': 'application/json',
			// 	},
			// 	body: JSON.stringify({ postID }),
			// })
			// const data = await response.json()
			// if (response.ok) {
			// Router.replace('/Home')
			// } else {
			// 	console.log(data)
			// }
		}
		const getUsableDate = (dateStr) => {
			const dateObj = new Date(dateStr)
			const options = { year: 'numeric', month: 'long', day: 'numeric' }
			const formattedDate = new Intl.DateTimeFormat('en-us', options).format(dateObj)
			return formattedDate
		}

		const user = authors.filter((author) => author.email === data.user.email)
		return (
			<>
				{showModal && (
					<div className="confirm-modal">
						<div className="modal-content">
							<h2>Are you sure?</h2>
							<p>This action cannot be reverted. This post will be lost forever.</p>
							<div className="buttons">
								<button onClick={() => setShowModal(false)}>No, Cancel</button>
								<button onClick={() => handleDelete(deleteID)}>Yes, I am</button>
							</div>
						</div>
					</div>
				)}

				<Navbar userData={user} />
				<main className="posts-container home">
					<h1>
						Welcome <span>{data.user.name}</span>
					</h1>
					<div className="cards-grid">
						{posts.map((item) => {
							if (item.author_id === user[0].id) {
								return (
									<div className="card" key={item.post_id}>
										<h3>{item.title}</h3>
										<span className="post-action" data-post-id={item.post_id} onClick={confirmDelete}>
											<AiOutlineDelete></AiOutlineDelete> Delete
										</span>
										<span className="post-action" data-post-id={item.post_id} data-post-title={item.title} data-post-content={item.content} onClick={handleEdit}>
											<AiOutlineEdit></AiOutlineEdit> Edit
										</span>
										<p>{item.content}</p>
										<p className="comments-count">
											<VscComment></VscComment>
											<span>{commentsQuantity.filter((comment) => comment.post_id === item.post_id).length}</span>
										</p>
										<div className="bottom">
											<small>{getUsableDate(item.date_created)}</small>
										</div>
									</div>
								)
							}
						})}
					</div>
				</main>
			</>
		)

		return <div>loading</div>
	}
}
export async function getStaticProps() {
	const [usersPosts] = await connection.promise().query('SELECT * FROM userposts ORDER BY post_id desc')
	const [postsCommentsQuantity] = await connection.promise().query(`SELECT * FROM postcomments`)
	const [postsAuthors] = await connection.promise().query(`SELECT * FROM userdata`)

	const posts = JSON.parse(JSON.stringify(usersPosts))
	const commentsQuantity = JSON.parse(JSON.stringify(postsCommentsQuantity))
	const authors = JSON.parse(JSON.stringify(postsAuthors))

	return {
		props: {
			posts,
			commentsQuantity,
			authors,
		},
	}
}
export default Home
