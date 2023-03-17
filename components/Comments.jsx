import React from 'react'
import Comment from './Comment'

export default function Comments({ comments, users, id }) {
	return (
		<div className="comments-container">
			<h2>Comments ({comments.length}): </h2>
			{comments.map((comment, index) => {
				if (comment.parent_comment_id === null) return <Comment key={index} comment={comment} users={users} allComments={comments} id={id} />
			})}
		</div>
	)
}
