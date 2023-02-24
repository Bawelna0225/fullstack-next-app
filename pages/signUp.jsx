import React from 'react'
import { useState } from 'react'
import { useRouter } from 'next/router'

const signUp = () => {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')
	const [signUpStatus, setSignUpStatus] = useState('')
	const router = useRouter()

	async function handleSignUp(event) {
		event.preventDefault()
		const response = await fetch('/api/sign_up', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name, email, password, confirmPassword }),
		})

		const data = await response.json()

		if (response.ok) {
			// Save the user email in the session
			sessionStorage.setItem('userEmail', email)
			// Redirect the user to the home page

			setSignUpStatus(`Thanks for joining us, ${email}!`)
			setTimeout(() => {
				router.push('/Home')
				window.location.href = '/Home'
			}, 2000)
		} else {
			setSignUpStatus(`${data.message}`)
		}
	}

	return (
		<form onSubmit={handleSignUp}>
			<input type="text" placeholder='Full Name' required value={name} onChange={(e) => setName(e.target.value)} />
			<input type="email" placeholder='Email' required value={email} onChange={(e) => setEmail(e.target.value)} />
			<input type="password" placeholder='Password' required value={password} onChange={(e) => setPassword(e.target.value)} />
			<input type="password" placeholder='Confirm Password' required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
			<button>Sign Up</button>
			<p>{signUpStatus}</p>
		</form>
	)
}

export default signUp
