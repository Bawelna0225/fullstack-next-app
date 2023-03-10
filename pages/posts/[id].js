import React from 'react'
import connection from '../../utils/db'
import Router from 'next/router'
import Navbar from '@/components/Navbar'
import { useSession } from 'next-auth/react'
import Comments from '@/components/Comments'

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
	const [selectComments] = await connection.promise().query(`SELECT * FROM postcomments WHERE post_id = ${id} ORDER BY comment_id desc`)
	const [selectUsers] = await connection.promise().query(`SELECT * FROM userdata`)

	const posts = JSON.parse(JSON.stringify(usersPosts))
	const comments = JSON.parse(JSON.stringify(selectComments))
	const users = JSON.parse(JSON.stringify(selectUsers))
	return {
		props: {
			posts,
			comments,
			users,
		},
	}
}
export default function Post({ posts, comments, users }) {
	const { status, data } = useSession()

	const getUsableDate = (dateStr) => {
		const dateObj = new Date(dateStr)
		const options = { year: 'numeric', month: 'long', day: 'numeric' }
		const formattedDate = new Intl.DateTimeFormat('en-us', options).format(dateObj)
		return formattedDate
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
				<Comments comments={comments} users={users} />
			</div>
		</>
	)
}
