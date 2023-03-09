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

	const user = authors.filter((author) => author.email === data?.user.email)
	return (
		<>
			<Navbar userData={user} />
			<div>
				<h1>{posts[0].title}</h1>
				<pre>{posts[0].content}</pre>
			</div>
		</>
	)
}
