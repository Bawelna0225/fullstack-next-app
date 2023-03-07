import { useEffect, useState } from 'react'
import { VscComment } from 'react-icons/vsc'
import connection from '../utils/db'
import { useSession } from 'next-auth/react'
import Router from 'next/router'
import Navbar from '@/components/Navbar'

const Home = ({ posts, commentsQuantity, authors }) => {
	const { status, data } = useSession()

	useEffect(() => {
		if (status === 'unauthenticated') Router.replace('/auth/signin')
	}, [status])

	if (status === 'authenticated') {
		const getUsableDate = (dateStr) => {
			const dateObj = new Date(dateStr)
			const options = { year: 'numeric', month: 'long', day: 'numeric' }
			const formattedDate = new Intl.DateTimeFormat('en-us', options).format(dateObj)
			return formattedDate
		}

		const user = authors.filter((author) => author.email === data.user.email)
		return (
			<>
				<Navbar userData={user}/>
				<main className="posts-container home">
					<h1>Welcome <span>{data.user.name}</span></h1>
					<div className="cards-grid">
						{posts.map((item) => {
							if (item.author_id === user[0].id) {
								return (
									<div className="card" key={item.post_id}>
										<h3>{item.title}</h3>
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
	// const  getUserData = async (data) => {
	// 	const email = data?.user.email
	// 	const [users] = await connection.promise().query(`SELECT * FROM userdata`)

	// 	return users.find((user) => user.email === email)
	// 	// return pic
	// }
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
