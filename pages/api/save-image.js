import fs from 'fs'
import connection from '../../utils/db'
export const config = {
	api: {
		bodyParser: {
			sizeLimit: '10mb', // Set desired value here
		},
	},
}
const deletePicture = async (filePath) => {
	try {
		await fs.promises.unlink(filePath)
		console.log(`File ${filePath} deleted successfully`)
	} catch (error) {
		console.error(`Error deleting file ${filePath}: ${error}`)
	}
}
export default async function saveImage(req, res) {
	const { dataUrl, email } = req.body
	const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '')
	const fileName = Date.now() + '.png'
	const filePath = 'public/images/' + fileName
	try {
		const oldPictureName = await findOldPicture(email)
		if (oldPictureName !== null) {
			await deletePicture(`public/images/${oldPictureName}`)
		}
		await fs.promises.writeFile(filePath, base64Data, 'base64')
		savePicInDatabase(fileName, email)
		res.status(200).json({ success: true })
	} catch (error) {
		console.error(error)
		res.status(500).json({ error: 'Failed to save image' })
	}
}
async function findOldPicture(email) {
	const sql = `SELECT * from userdata WHERE email = ?`
	const values = [email]
	try {
		const [result] = await connection.promise().execute(sql, values)
		return result[0].picture
	} catch (error) {
		console.error(`Picture not found: ${error}`)
		return null
	}
}
async function savePicInDatabase(picture_name, email) {
	const sql = `UPDATE userdata SET picture = ? WHERE email = ?`
	const values = [picture_name, email]

	try {
		const [result] = await connection.promise().execute(sql, values)
		return true
	} catch (error) {
		console.error(`Error saving picture in database: ${error}`)
		return null
	}
}
