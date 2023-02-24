import { useState } from 'react'
import { useRouter } from 'next/router'
import Router from "next/router";
export default function LoginPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loginStatus, setLoginStatus] = useState('')
	const router = useRouter()

	async function handleLogin(event) {
		event.preventDefault()
		const response = await fetch('/api/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email, password }),
		})

		const data = await response.json()

		if (response.ok) {
			// Save the user email in the session
			sessionStorage.setItem('userEmail', email)
			// Redirect the user to the home page

			setLoginStatus(`Logging in successful, Welcome ${email}`)
			setTimeout(() => {
				Router.replace("/Home")
			}, 2000)
		} else {
			setLoginStatus(`${data.message}`)
		}
	}

	return (
		<form onSubmit={handleLogin}>
			<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
			<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
			<button>Log In</button>
			<p>{loginStatus}</p>
		</form>
	)
}
