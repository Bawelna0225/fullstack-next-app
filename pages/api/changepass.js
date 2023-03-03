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
	const hashedPassword = await hashPassword(password)
	const userData = {
		newPassword: newPassword,
		user_id: userId,
	}
}

async function hashPassword(password) {
	const saltRounds = 10
	const hashedPassword = await bcrypt.hash(password, saltRounds)
	return hashedPassword
}

async function findUserInDatabase(email) {
	// pobranie użytkownika z bazy danych na podstawie adresu email

	const [users] = await connection.promise().query(`SELECT * FROM userdata`)

	return users.find((user) => user.email === email)
}

async function updateUserPassword(userData) {}
