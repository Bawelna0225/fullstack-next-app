import React from 'react'
import connection from '../../utils/db'
import Navbar from '@/components/Navbar'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { RiArticleLine, RiGithubFill } from 'react-icons/ri'

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
	const { status, data } = useSession()
	const getUsableDate = (dateStr) => {
		const dateObj = new Date(dateStr)
		const options = { year: 'numeric', month: 'long', day: 'numeric' }
		const formattedDate = new Intl.DateTimeFormat('en-us', options).format(dateObj)
		return formattedDate
	}

	const loggedUser = allUsers.filter((user) => user.email === data?.user.email)
	return (
		<>
			<Navbar userData={loggedUser} />
			<div className='user-introduction'>
				{user[0].picture === null ? (
					<Image src={`/images/Default_pfp.png`} width={150} height={150} alt={user[0].name}></Image>
				) : (
					<Image src={`/images/${user[0].picture}`} width={150} height={150} alt={user[0].name}></Image>
				)}
				<h1>{user[0].name}</h1>
				<p>Joined on: <b>{getUsableDate(user[0].date_joined)}</b></p>
				<p>{details[0].introduction}</p>
				<p>
					<RiArticleLine></RiArticleLine> Posts: {posts.length}
				</p>
				<div className="socials">
					{details[0].github && (
						<p>
							<RiGithubFill></RiGithubFill>
							Github: <Link href={details[0].github}>{details[0].github}</Link>
						</p>
					)}
					{details[0].website && (
						<p>
							<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<path d="M19.5 7a9 9 0 0 0 -7.5 -4a8.991 8.991 0 0 0 -7.484 4"></path>
								<path d="M11.5 3a16.989 16.989 0 0 0 -1.826 4"></path>
								<path d="M12.5 3a16.989 16.989 0 0 1 1.828 4"></path>
								<path d="M19.5 17a9 9 0 0 1 -7.5 4a8.991 8.991 0 0 1 -7.484 -4"></path>
								<path d="M11.5 21a16.989 16.989 0 0 1 -1.826 -4"></path>
								<path d="M12.5 21a16.989 16.989 0 0 0 1.828 -4"></path>
								<path d="M2 10l1 4l1.5 -4l1.5 4l1 -4"></path>
								<path d="M17 10l1 4l1.5 -4l1.5 4l1 -4"></path>
								<path d="M9.5 10l1 4l1.5 -4l1.5 4l1 -4"></path>
							</svg>
							Website: <Link href={details[0].website}>{details[0].website}</Link>
						</p>
					)}
				</div>
			</div>
		</>
	)
}
