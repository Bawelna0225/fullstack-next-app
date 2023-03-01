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
				setLoginStatus(null)
				setLoginMessage(``)
				Router.replace('/Home')
			}, 3000)
		} else {
			setLoginMessage(`Invalid Password or Email`)
			setLoginStatus(false)
			setTimeout(() => {
				setLoginStatus(null)
				setLoginMessage(``)
			}, 3000)
		}
	}
	return (
		<div className="sign-in-form">
			<div className="custom-shape-divider-top-1677324190">
				<svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
					<path
						d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
						opacity=".25"
						className="shape-fill"
					></path>
					<path
						d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
						opacity=".5"
						className="shape-fill"
					></path>
					<path
						d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
						className="shape-fill"
					></path>
				</svg>
			</div>
			<div className="custom-shape-divider-bottom-1677324005">
				<svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
					<path
						d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
						opacity=".25"
						className="shape-fill"
					></path>
					<path
						d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
						opacity=".5"
						className="shape-fill"
					></path>
					<path
						d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
						className="shape-fill"
					></path>
				</svg>
			</div>
			<form onSubmit={handleSubmit}>
				<h1>Log In</h1>
				{loginMessage ? loginStatus == false ? <p className="error">{loginMessage}<span></span></p> : <p className="success">{loginMessage}<span></span></p> : <></>}
				
				<p>
					Log in with your Email & Password
				</p>
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
				<small>
					<Link href="#">Forgot Password?</Link>
				</small>
				<div className="button">
					<input className="button" type="submit" value="Login" />
				</div>

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
