import React from 'react'
import connection from '../../utils/db'

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
	const posts = JSON.parse(JSON.stringify(usersPosts))

	return {
		props: {
			posts,
		},
	}
}
export default function Post({ posts }) {
    console.log();
	return <div>
        <h1>{posts[0].title}</h1>
        <pre>{posts[0].content}</pre>
    </div>
}
