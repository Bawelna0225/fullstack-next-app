import Image from 'next/image'
import React, { useState } from 'react'
import { BsReply } from 'react-icons/bs'
import image from '../public/images/1678183610311.png'

export default function Comments({ comments, users }) {
	const [commentContent, setCommentContent] = useState('')
	const handleSubmitComment = (e) => {
		e.preventDefault()
		console.log(commentContent)
	}
	const getUsableDate = (dateStr) => {
		const dateObj = new Date(dateStr)
		const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }
		const formattedDate = new Intl.DateTimeFormat('en-us', options).format(dateObj)
		return formattedDate
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
					<button type="submit">
						<span>
							Submit
							<svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
								<path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"></path>
							</svg>
						</span>
					</button>
				</div>
			</form>
			<h2>Comments ({comments.length}): </h2>
			<div className="comments-container">
				{comments.map((comment) => (
					<div className="user-comment">
						<small>{getUsableDate(comment.date_created)}</small>
						<div className="user">
							<Image src={image} alt='pfp'></Image>
							<p>
								<b>{users.map((user) => {
										if(user.id === comment.user_id) return <p key={user.id}>{user.name}</p>
									})}</b>
							</p>
						</div>
						<p className='comment-content'>{comment.content}</p>
						<button className="reply">
							<BsReply></BsReply> reply
						</button>
					</div>
				))}
			</div>
		</div>
	)
}
