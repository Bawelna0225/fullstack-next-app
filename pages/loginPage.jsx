import { useState } from 'react'

export default function LoginPage() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loginStatus, setLoginStatus] = useState('')


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
			// Zalogowano użytkownika - można przekierować na inną stronę lub wykonać jakąś inną akcję
			setLoginStatus(`Logged In ID:${data.user.id} Email:${data.user.email}`)
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


