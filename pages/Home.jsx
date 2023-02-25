import { useEffect, useState } from 'react'
import { signOut } from 'next-auth/react'
import { useSession } from 'next-auth/react'
import Router from 'next/router'
import Navbar from '@/components/Navbar'

const Home = () => {
	const { status, data } = useSession()

	useEffect(() => {
		if (status === 'unauthenticated') Router.replace('/auth/signin')
	}, [status])

	if (status === 'authenticated')
		return (
			<>
				<Navbar/>
				<h1>Welcome {data.user.name}</h1>
			</>
		)

	return <div>loading</div>
}

export default Home
