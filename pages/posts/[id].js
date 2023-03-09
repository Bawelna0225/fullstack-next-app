import React from 'react'
import connection from '../../utils/db'
import Router from 'next/router'
import Navbar from '@/components/Navbar'
import { useSession } from 'next-auth/react'

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
	const [postsAuthors] = await connection.promise().query(`SELECT * FROM userdata`)

	const posts = JSON.parse(JSON.stringify(usersPosts))
	const authors = JSON.parse(JSON.stringify(postsAuthors))
	return {
		props: {
			posts,
			authors,
		},
	}
}
export default function Post({ posts, authors }) {
	const { status, data } = useSession()

	const getUsableDate = (dateStr) => {
		const dateObj = new Date(dateStr)
		const options = { year: 'numeric', month: 'long', day: 'numeric' }
		const formattedDate = new Intl.DateTimeFormat('en-us', options).format(dateObj)
		return formattedDate
	}

	const user = authors.filter((author) => author.email === data?.user.email)
	const postAuthor = authors.filter((author) => author.id === posts[0].author_id)
	return (
		<>
			<Navbar userData={user} />
			<div className="post-container">
				<div className="top">
					<p>Created: <span>{getUsableDate(posts[0].date_created)}</span></p>
					<p>By: <span>{postAuthor[0].name}</span></p>
				</div>
				<div className="post-content">
					<h1>{posts[0].title}</h1>
					<pre>{posts[0].content}</pre>
				</div>
			</div>
		</>
	)
}
