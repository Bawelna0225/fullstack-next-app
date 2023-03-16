import React from 'react'
import connection from '../../utils/db'
import Navbar from '@/components/Navbar'
import { useSession } from 'next-auth/react'

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

export default function UserPage() {
  return (
    <div>UserPage</div>
  )
}
