import React from 'react'
import connection from '../../utils/db'
import Navbar from '@/components/Navbar'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'

export const getStaticPaths = async () => {
	const [usersInfo] = await connection.promise().query('SELECT * FROM userdata')
	const users = JSON.parse(JSON.stringify(usersInfo))

	const paths = users.map((user) => {
		return {
			params: {
				id: user.id.toString(),
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
	const [selectUser] = await connection.promise().query(`SELECT * FROM userdata WHERE id = ${id}`)
	const [selectAllUsers] = await connection.promise().query(`SELECT * FROM userdata`)
	const [userPosts] = await connection.promise().query(`SELECT * FROM userposts WHERE author_id = ${id}`)
	const [userDetails] = await connection.promise().query(`SELECT * FROM userdetails WHERE id = ${id}`)

	const user = JSON.parse(JSON.stringify(selectUser))
	const allUsers = JSON.parse(JSON.stringify(selectAllUsers))
	const posts = JSON.parse(JSON.stringify(userPosts))
	const details = JSON.parse(JSON.stringify(userDetails))
	return {
		props: {
			user,
			allUsers,
			posts,
			details,
			id,
		},
	}
}
export default function UserPage({ user, allUsers, posts, details, id }) {
	return <></>
}
