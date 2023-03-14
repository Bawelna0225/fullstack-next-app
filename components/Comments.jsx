import Image from 'next/image'
import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import Comment from './Comment'

export default function Comments({ comments, users, id }) {
	const [commentContent, setCommentContent] = useState('')
	const { status, data } = useSession()
	const handleSubmitComment = async (e) => {
		const email = data.user.email
		e.preventDefault()

		const response = await fetch('/api/save-comment', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ id, commentContent, email }),
		})
		const info = await response.json()
		if (response.ok) {
			window.location.reload()
		} else {
			console.error('Error', info)
		}
		console.log(info)
	}
	return (
		<div className="comments">
			<h2>Leave Your Comment</h2>
			<form onSubmit={handleSubmitComment}>
				<textarea placeholder="Your thoughts ..." required value={commentContent} onChange={({ target }) => setCommentContent(target.value)}></textarea>
				<div className="buttons">
					<button type="reset" onClick={() => setCommentContent('')}>
						<span>
							Cancel
							<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
								<path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855a.75.75 0 0 0-.124 1.329l4.995 3.178 1.531 2.406a.5.5 0 0 0 .844-.536L6.637 10.07l7.494-7.494-1.895 4.738a.5.5 0 1 0 .928.372l2.8-7Zm-2.54 1.183L5.93 9.363 1.591 6.602l11.833-4.733Z"></path>
								<path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Zm-4.854-1.354a.5.5 0 0 0 0 .708l.647.646-.647.646a.5.5 0 0 0 .708.708l.646-.647.646.647a.5.5 0 0 0 .708-.708l-.647-.646.647-.646a.5.5 0 0 0-.708-.708l-.646.647-.646-.647a.5.5 0 0 0-.708 0Z"></path>
							</svg>
						</span>
					</button>
					<button type="submit" disabled={status === 'unauthenticated'}>
						<span>
							Submit
							<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
								<path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"></path>
							</svg>
						</span>
					</button>
				</div>
			</form>
			<div className="comments-container">
				<h2>Comments ({comments.length}): </h2>
				{comments.map((comment, index) => {
					if (comment.parent_comment_id === null) return <Comment comment={comment} users={users} allComments={comments} id={id} key={index} />
				})}
			</div>
		</div>
	)
}
