import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import Router from 'next/router'


export default function createPost() {
	const [postInfo, setPostInfo] = useState({ title: '', content: '' })

	const handleSubmit = async (e) => {
		e.preventDefault()
	}
	const { status, data } = useSession()

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
						<input value={postInfo.title} onChange={({ target }) => setPostInfo({ ...postInfo, title: target.value })} type="text" required />
					</div>
					<div className="input">
						<span className="content"></span>
						<label htmlFor="">Content</label>
						<textarea value={postInfo.content} onChange={({ target }) => setPostInfo({ ...postInfo, content: target.value })} required />
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
