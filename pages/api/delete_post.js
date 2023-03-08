import connection from '../../utils/db'

export default async function handler(req, res) {
	const { postID } = req.body

	if (!postID) {
		res.status(401).json({ message: 'Wrong ID' })
		return
	}

	const deleteStatus = await deletePost(postID)
	res.status(200).json({ deleteStatus })
}

async function deletePost(postID) {
	const sql = `DELETE FROM userposts WHERE post_id = ?`
	const values = [postID]

	try {
		const [result] = await connection.promise().execute(sql, values)
		return true
	} catch (error) {
		console.error(`Something went wrong: ${error}`)
		return null
	}
}
