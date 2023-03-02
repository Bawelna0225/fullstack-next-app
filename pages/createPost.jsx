import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import Router from 'next/router'

export default function createPost() {
	const [postTitle, setPostTitle] = useState('')
	const [postContent, setContent] = useState('')
	const { status, data } = useSession()
	const handleSubmit = async (e) => {
		const email = data.user.email
		e.preventDefault()

		const response = await fetch('/api/savepost', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ postTitle, postContent, email }),
		})
		const info = await response.json()
		if (response.ok) {

			resetForm()

		} else {

		}
	}
	function resetForm() {
		setPostTitle('')
		setContent('')
	}
	useEffect(() => {
		if (status === 'unauthenticated') Router.replace('/auth/signin')
	}, [status])

	if (status === 'authenticated') {
		return (
			<div className="create-post">
				<form onSubmit={handleSubmit}>
					<h1>Create Post</h1>
					<div className="input">
						<span className="title"></span>
						<label htmlFor="">Title</label>
						<input value={postTitle} onChange={({ target }) => setPostTitle(target.value)} type="text" required />
					</div>
					<div className="input">
						<span className="content"></span>
						<label htmlFor="">Content</label>
						<textarea value={postContent} onChange={({ target }) => setContent(target.value)} required />
					</div>
					<div className="buttons">
						<small>
							<Link href="/">Changed your mind?</Link>
						</small>

						<button className="button" type="submit">
							<span>Create Post</span>
						</button>
					</div>
				</form>
			</div>
		)
	}
}
