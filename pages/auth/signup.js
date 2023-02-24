import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Router from 'next/router'
import Link from 'next/link'

export default function SignUp() {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const [loginStatus, setLoginStatus] = useState('')
	const handleSubmit = async (e) => {
		e.preventDefault()
		const response = await fetch('/api/sign_up', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ name, email, password, confirmPassword }),
		})
		const data = await response.json()
		if (response.ok) {
			const res = await signIn('credentials', {
				email: email,
				password: password,
				redirect: false,
			})
			setLoginStatus(`Glad You Joined Us, Enjoy Your Stay!`)
			setTimeout(() => {
				Router.replace('/Home')
			}, 2000)
		} else {
			setLoginStatus(`${data.message}`)
		}
	}
	return (
		<div className="sign-in-form">
			<form onSubmit={handleSubmit}>
				<h1>Sign Up</h1>
				{loginStatus}
				<input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Full Name" />
				<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email" />
				<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="Password" />
				<input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" placeholder="Confirm Password" />
				<input type="submit" value="Login" />
			</form>
			<Link href="/auth/signin">You already have account?</Link>
		</div>
	)
}
