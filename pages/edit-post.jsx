import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import Router from 'next/router'

export default function createPost() {
	const [postTitle, setPostTitle] = useState('')
	const [postContent, setContent] = useState('')
	const { status, data } = useSession()

	const [postCreationStatus, setPostCreationStatus] = useState(false)
	const [postMessage, setPostMessage] = useState('')
	useEffect(() => {
		const { postID, postTitle, postContent} = Router.query
		setPostTitle(postTitle || '')
		setContent(postContent || '')
	}, [])
	const handleSubmit = async (e) => {
		e.preventDefault()

		const response = await fetch('/api/update-post', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ postID, postTitle, postContent }),
		})
		const info = await response.json()
		if (response.ok) {
			setPostMessage(`Post Updated, You will be redirected`)
			setPostCreationStatus(true)
			resetForm()
			setTimeout(() => {
				setPostCreationStatus(null)
				setPostMessage(``)
				Router.replace('/Home')
			}, 3000)
		} else {
			setPostMessage(`Something went wrong: ${info}`)
			setPostCreationStatus(false)
			setTimeout(() => {
				setPostCreationStatus(null)
				setPostMessage(``)
			}, 3000)
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
				{postMessage ? (
					postCreationStatus == false ? (
						<p className="error">
							{postMessage}
							<span></span>
						</p>
					) : (
						<p className="success">
							{postMessage}
							<span></span>
						</p>
					)
				) : (
					<></>
				)}
				<form onSubmit={handleSubmit}>
					<h1>Edit Post</h1>
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
							<Link href="/Home">Changed your mind?</Link>
						</small>

						<button className="button" type="submit">
							<span>Update Post</span>
						</button>
					</div>
				</form>
			</div>
		)
	}
}
