import connection from '../../utils/db'

export default async function handler(req, res) {
	const id = req.body

    const selectComments = await selectPostComments(id)
	res.status(200).json({ selectComments })

	async function selectPostComments(id) {
		const sql = `SELECT * FROM postcomments WHERE post_id = ${id} ORDER BY comment_id desc`
		try {
			const [result] = await connection.promise().execute(sql)
	        return result
		} catch (error) {
			console.error(`Error fetching comments: ${error}`)
			return null
		}
	}
}
