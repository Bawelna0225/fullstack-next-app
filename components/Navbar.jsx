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
		<nav>
			<Link href="/">BlogPage.</Link>
			<div className="buttons">
				<Link href="/createPost">
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
						<Link href="/Home">
							<AiOutlineHome></AiOutlineHome>
							<span>Home</span>
						</Link>
					</li>
					<li>
						<Link href="/change-picture">
							<SlPicture></SlPicture>
							<span>Change Profile Picture</span>
						</Link>
					</li>
					<li>
						<Link href="/change-password">
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
	) : (
		<nav>
			<Link href="/">BlogPage.</Link>
			<div className="buttons">
				<Link href="/auth/signin">
					<SlLogin></SlLogin> <span>Log in</span>{' '}
				</Link>
				<Link href="/auth/signup">
					<AiOutlineUserAdd></AiOutlineUserAdd> <span>Sign up</span>
				</Link>
			</div>
		</nav>
	)
}
const handleSignOut = async () => {
	const data = await signOut({ redirect: false, callbackUrl: '/' })
}
