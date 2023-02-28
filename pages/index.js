import Head from 'next/head'
import connection from '../utils/db'
import { Inter } from '@next/font/google'
import Posts from './Posts'
import Navbar from '@/components/Navbar'

export default function Home({ posts, commentsQuantity, author }) {
	return (
		<>
			<Head>
				<title>Create Next App</title>
				<meta name="description" content="Generated by create next app" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<Navbar />
			<Posts posts={posts} commentsQuantity={commentsQuantity} authors={author}  />
		</>
	)
}

export async function getStaticProps() {
	const [usersPosts] = await connection.promise().query('SELECT * FROM userposts ORDER BY post_id desc')
	const [postsCommentsQuantity] = await connection.promise().query(`SELECT * FROM postcomments`)
	const [postsAuthors] = await connection.promise().query(`SELECT * FROM userdata`)
	
	const posts = JSON.parse(JSON.stringify(usersPosts))
	const commentsQuantity = JSON.parse(JSON.stringify(postsCommentsQuantity))
	const author = JSON.parse(JSON.stringify(postsAuthors))

	return {
		props: {
			posts,
			commentsQuantity,
			author,
		},
	}
}
