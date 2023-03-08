import connection from '../../utils/db'

export default async function handler(req, res) {
	const { postID, postTitle, postContent } = req.body

	if (!postID) {
		res.status(401).json({ message: 'Wrong ID' })
		return
	}
	const date = await getCurrentDate()
	const postData = {
		postID: postID,
		postTitle: postTitle,
		postContent: postContent,
		date: date,
	}
	const updateStatus = await updatePost(postData)
	res.status(200).json({ updateStatus })
}
async function getCurrentDate() {
	const currentDate = new Date()

	const year = currentDate.getFullYear()
	const month = String(currentDate.getMonth() + 1).padStart(2, '0')
	const day = String(currentDate.getDate()).padStart(2, '0')

	const formattedDate = `${year}-${month}-${day}`

	return formattedDate
}
async function updatePost(postData) {
	const { postTitle, postContent, date, postID } = postData
	const sql = `UPDATE userposts SET title = ?, content = ? , date_created = ? WHERE post_id = ?`
	const values = [postTitle, postContent, date, postID]

	try {
		const [result] = await connection.promise().execute(sql, values)
		return true
	} catch (error) {
		console.error(`Something went wrong: ${error}`)
		return null
	}
}
