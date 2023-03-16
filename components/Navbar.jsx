import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import { SlLogin, SlLogout, SlPicture } from 'react-icons/sl'
import { AiOutlineHome, AiOutlineUserAdd } from 'react-icons/ai'
import { GrChapterAdd, GrPowerReset } from 'react-icons/gr'
import Image from 'next/image'

export default function Navbar(userData) {
	const { status, data } = useSession()
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [profilePic, setProfilePic] = useState()

	const handleToggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen)
	}
	const createUserLogo = (username) => {
		if (!profilePic) {
			const userLogo = document.querySelector('.toggle')
			var matches = username.match(/\b(\w)/g)
			var acronym = matches.join('')
			userLogo.innerHTML = acronym.toUpperCase()
		}
	}
	useEffect(() => {
		const closeDropdown = (event) => {
			if (!document.querySelector('.toggle').contains(event.target) && !document.querySelector('.dropdown').contains(event.target)) {
				// if user clicks outside menu close it
				setIsDropdownOpen(false)
			}
		}
		if (status === 'authenticated') {
			const picName = userData.userData[0].picture
			import(`../public/images/${picName}`)
				.then((pic) => setProfilePic(pic.default))
				.catch((error) => console.log(error))
			if (!profilePic) {
				createUserLogo(data.user.name)
			}
			window.addEventListener('click', closeDropdown)
		}
		return () => {
			window.removeEventListener('click', closeDropdown)
		}
	}, [status])

	return status === 'authenticated' ? (
		<>
			{isLoading && (
				<div className="loader">
					<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 38 38">
						<defs>
							<linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
								<stop stopColor="#fff" stopOpacity="0" offset="0%" />
								<stop stopColor="#fff" stopOpacity=".631" offset="63.146%" />
								<stop stopColor="#fff" offset="100%" />
							</linearGradient>
						</defs>
						<g fill="none" fillRule="evenodd">
							<g transform="translate(1 1)">
								<path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" strokeWidth="2">
									<animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite" />
								</path>
								<circle fill="#fff" cx="36" cy="18" r="1">
									<animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="0.9s" repeatCount="indefinite" />
								</circle>
							</g>
						</g>
					</svg>
				</div>
			)}

			<nav>
				<Link href="/" onClick={() => setIsLoading(true)}>
					BlogPage.
				</Link>
				<div className="buttons">
					<Link href="/createPost" onClick={() => setIsLoading(true)}>
						<GrChapterAdd></GrChapterAdd>
						<span>Create Post</span>
					</Link>
					<button
						className="toggle"
						onClick={() => {
							handleToggleDropdown()
						}}
					>
						{profilePic ? <Image src={profilePic} alt="Picture of the author" width={40} height={40} /> : <></>}
					</button>
				</div>
				<div className={isDropdownOpen ? 'dropdown open' : 'dropdown'}>
					<ul>
						<li>
							<Link href="/Home" onClick={() => setIsLoading(true)}>
								<AiOutlineHome></AiOutlineHome>
								<span>Home</span>
							</Link>
						</li>
						<li>
							<Link href="/change-picture" onClick={() => setIsLoading(true)}>
								<SlPicture></SlPicture>
								<span>Change Profile Picture</span>
							</Link>
						</li>
						<li>
							<Link href="/change-password" onClick={() => setIsLoading(true)}>
								<GrPowerReset></GrPowerReset>
								<span>Change Password</span>
							</Link>
						</li>
						<li>
							<button
								onClick={() => {
									handleSignOut()
								}}
							>
								<SlLogout></SlLogout>
								<span>Log out</span>
							</button>
						</li>
					</ul>
				</div>
			</nav>
		</>
	) : (
		<>
			<nav>
				<Link href="/" onClick={() => setIsLoading(true)}>
					BlogPage.
				</Link>
				<div className="buttons">
					<Link href="/auth/signin" onClick={() => setIsLoading(true)}>
						<SlLogin></SlLogin> <span>Log in</span>{' '}
					</Link>
					<Link href="/auth/signup" onClick={() => setIsLoading(true)}>
						<AiOutlineUserAdd></AiOutlineUserAdd> <span>Sign up</span>
					</Link>
				</div>
			</nav>
		</>
	)
}
const handleSignOut = async () => {
	const data = await signOut({ redirect: false, callbackUrl: '/' })
}
