import React from 'react'
import { withIronSession } from 'next-iron-session'

const Home = ({ user }) => {
	return (
		<div>
			<h1>Your Profile</h1>
			<p>Important user data here</p>
		</div>
	)
}

export default Home
