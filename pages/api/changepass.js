import connection from '../../utils/db'

export default async function handler(req, res) {
	const { email, password, confirmPassword } = req.body

	const user = await findUserInDatabase(email)
	const userId = user.id

	const passwordMatch = password === confirmPassword

	if (!passwordMatch) {
		res.status(401).json({ message: "Passwords Don't Match" })
		return
	}
	const userData = {
		newPassword: newPassword,
		user_id: userId,
	}
}

async function findUserInDatabase(email) {
	// pobranie użytkownika z bazy danych na podstawie adresu email

	const [users] = await connection.promise().query(`SELECT * FROM userdata`)

	return users.find((user) => user.email === email)
}

async function updateUserPassword(userData) {}
