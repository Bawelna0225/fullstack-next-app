import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'

const Home = () => {
	const [email, setEmail] = useState('')
	const [token, setToken] = useState('')
	const router = useRouter()

	useEffect(() => {
		setEmail(Cookies.get('email'))
		setToken(Cookies.get('token'))

	}, [])

	return (
		<div>
			<h1>Your Profile</h1>
			<p>Important user data here</p>
			<p>{email}</p>
		</div>
	)
}

export default Home
