import connection from '../../utils/db'

export default async function handler(req, res) {
	const {
		userDetails: { github, introduction, website },
		email,
	} = req.body

	const user = await findUserInDatabase(email)
	const userId = user.id

	const details = {
		introduction: introduction,
		github: github,
		website: website,
		userId: userId,
	}
	const saveDetails = await saveDetailsInDatabase(details)
	res.status(200).json({ saveDetails })
}

async function findUserInDatabase(email) {
	// pobranie użytkownika z bazy danych na podstawie adresu email

	const [users] = await connection.promise().query(`SELECT * FROM userdata`)

	return users.find((user) => user.email === email)
}

async function saveDetailsInDatabase(details) {
	const { introduction, github, website, userId } = details
	const sql = 'UPDATE userdetails SET introduction = ?, github = ?, website = ? WHERE id = ?'
	const values = [introduction, github, website, userId]
	return values
}
