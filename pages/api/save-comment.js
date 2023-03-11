import connection from '../../utils/db'

export default async function handler(req, res) {
	const { id, commentContent, email } = req.body

	const user = await findUserInDatabase(email)
	const userId = user.id

	const date = await getCurrentDate()
	const commentData = {
		post_id: id,
		user_id: userId,
		content: commentContent,
		date: date,
	}
	const createNewComment = await saveCommentInDatabase(commentData)
	res.status(200).json({ createNewComment })
}

async function getCurrentDate() {
	const date = new Date()
	const options = { timeZone: 'Europe/Warsaw', hour12: false }
	const formattedDate = date.toLocaleString('en-US', options)
	const [dateStr, timeStr] = formattedDate.split(', ')
	const [month, day, year] = dateStr.split('/')
	const [hour, minute, second] = timeStr.split(':')
	return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')} ${hour}:${minute}:${second}`

}
async function findUserInDatabase(email) {
	// pobranie użytkownika z bazy danych na podstawie adresu email

	const [users] = await connection.promise().query(`SELECT * FROM userdata`)

	return users.find((user) => user.email === email)
}

async function saveCommentInDatabase(comment) {
	const { post_id, user_id, content, date } = comment

	const sql = 'INSERT INTO `postcomments`(`comment_id`, `post_id`, `user_id`, `parent_comment_id`, `content`, `date_created`, `is_edited`) VALUES (NULL, ?, ?, NULL, ?, ? , 0)'
	const values = [post_id, user_id, content, date]

	try {
		const [result] = await connection.promise().execute(sql, values)
		return comment
	} catch (error) {
		console.error(`Error saving user to database: ${error}`)
		return null
	}
}
