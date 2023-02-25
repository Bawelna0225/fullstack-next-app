import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Router from 'next/router'
import Link from 'next/link'

const SignIn = () => {
	const [userInfo, setUserInfo] = useState({ email: '', password: '' })
	const [loginStatus, setLoginStatus] = useState()
	const [loginMessage, setLoginMessage] = useState('')
	const handleSubmit = async (e) => {
		e.preventDefault()

		const res = await signIn('credentials', {
			email: userInfo.email,
			password: userInfo.password,
			redirect: false,
		})
		if (res.ok) {
			setLoginMessage(`Logging in successful, Welcome!`)
			setLoginStatus(true)
			setTimeout(() => {
				Router.replace('/Home')
			}, 2000)
		} else {
			setLoginMessage(`Invalid Password or Email`)
			setLoginStatus(false)
		}
	}
	return (
		<div className="sign-in-form">
			<form onSubmit={handleSubmit}>
				<h1>Log In</h1>
				{loginMessage ? loginStatus == false ? <p className="error">{loginMessage}</p> : <p className="success">{loginMessage}</p> : <></>}

				<div className="input">
					<span className="email"></span>
					<label htmlFor="">Email</label>
					<input value={userInfo.email} onChange={({ target }) => setUserInfo({ ...userInfo, email: target.value })} type="email" required />
				</div>
				<div className="input">
					<span className="pass"></span>
					<label htmlFor="">Password</label>
					<input value={userInfo.password} onChange={({ target }) => setUserInfo({ ...userInfo, password: target.value })} type="password" required />
				</div>
				<div className="button">
					<input className="button" type="submit" value="Login" />
				</div>
				<small>
					<Link href="#">Forgot Password?</Link>
				</small>
				<p>
					New Here?
				<Link href="/auth/signup"> Sign Up</Link>

				</p>
			</form>
		</div>
	)
}

async function fetchUserFromDatabase(email) {
	// pobranie użytkownika z bazy danych na podstawie adresu email

	const [users] = await connection.promise().query(`SELECT * FROM userdata`)

	return users.find((user) => user.email === email)
}

export default SignIn
