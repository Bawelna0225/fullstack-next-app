import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

const Home = () => {
	let [authTokens, setAuthTokens] = useState(null)
	let [userEmail, setUserEmail] = useState(null)
	const router = useRouter()

	useEffect(() => {
		if (sessionStorage.getItem('userEmail')) {
			// setAuthTokens(sessionStorage.getItem('authTokens'))
			setUserEmail(sessionStorage.getItem('userEmail'))
		} else {
			// setAuthTokens(null)
			setUserEmail(null)
			router.push('/loginPage')
		}
	})

	return (
		<div>
			<p>Welcome, {userEmail}!</p>
		</div>
	)
}

export default Home
