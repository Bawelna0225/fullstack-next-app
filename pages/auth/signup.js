import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Router from 'next/router'
import Link from 'next/link'

export default function SignUp() {
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirmPassword, setConfirmPassword] = useState('')

	const [loginStatus, setLoginStatus] = useState(false)
	const [loginMessage, setLoginMessage] = useState('')
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
			setLoginMessage(`Glad You Joined Us, Enjoy Your Stay!`)
			setLoginStatus(true)
			setTimeout(() => {
				Router.replace('/Home')
			}, 2000)
		} else {
			setLoginMessage(`${data.message}`)
			setLoginStatus(false)
		}
	}
	return (
		<div className="sign-in-form">
			<form onSubmit={handleSubmit}>
				<h1>Sign Up</h1>
				{loginMessage ? loginStatus == false ? <p className="error">{loginMessage}</p> : <p className="success">{loginMessage}</p> : <></>}
				<div className="input">
					<span className="name"></span>
					<label htmlFor="">Full Name</label>
					<input value={name} onChange={(e) => setName(e.target.value)} type="text" required />
				</div>
				<div className="input">
					<span className="email"></span>
					<label htmlFor="">Email</label>
					<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
				</div>
				<div className="input">
					<span className="pass"></span>
					<label htmlFor="">Password</label>
					<input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
				</div>
				<div className="input">
					<span className="conpass"></span>
					<label htmlFor="">Confirm Password</label>
					<input value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" required />
				</div>
				<div className="button">
					<input className="button" type="submit" value="Sign Up" />
				</div>
				<p>
					<Link href="/auth/signin">You already have account?</Link>
				</p>
			</form>
		</div>
	)
}
