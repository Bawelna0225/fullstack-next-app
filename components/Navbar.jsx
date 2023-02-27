import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import { SlLogin, SlLogout, SlPicture } from 'react-icons/sl'
import { AiOutlineHome, AiOutlineUserAdd } from 'react-icons/ai'
import { GrChapterAdd, GrPowerReset } from 'react-icons/gr'

export default function Navbar() {
	const { status, data } = useSession()
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)

	const handleToggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen)
	}
	useEffect(() => {
		if (status === 'authenticated') {
			window.addEventListener('click', (event) => {
				if (!document.querySelector('.toggle').contains(event.target) && !document.querySelector('.dropdown').contains(event.target)) {
					// if user clicks outside menu close it
					setIsDropdownOpen(false)
				}
			})
		}
	}, [status])

	return status === 'authenticated' ? (
		<nav>
			<Link href="/">Index</Link>
			<div className="buttons">
				<Link href="#">
					<GrChapterAdd></GrChapterAdd>
					<span>Create Post</span>
				</Link>
				<button
					className="toggle"
					onClick={() => {
						handleToggleDropdown()
					}}
				>
					{data.user.name}
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
						<Link href="#">
							<SlPicture></SlPicture>
							<span>Profile Picture</span>
						</Link>
					</li>
					<li>
						<Link href="#">
							<GrPowerReset></GrPowerReset>
							<span>Password</span>
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
			<Link href="/">Index</Link>
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