import Link from 'next/link'
import React from 'react'
import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'

export default function Navbar() {
	const { status, data } = useSession()

	return status === 'authenticated' ? (
		<nav>
			<Link href="/">Index</Link>
			<div className="buttons">
				<button>Create Post</button>
				<button>{data.user.name}</button>
                <Link href="/Home">Home</Link>
				<button
					onClick={() => {
						handleSignOut()
					}}
				>
					Log out
				</button>
			</div>
		</nav>
	) : (
		<nav>
			<Link href="/">Index</Link>
			<div className="buttons">
				<Link href="/auth/signin">Log in </Link>
				<Link href="/auth/signup">Sign Up</Link>
			</div>
		</nav>
	)
}
const handleSignOut = async () => {
	const data = await signOut({ redirect: false, callbackUrl: '/' })
}