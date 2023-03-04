import connection from '../../utils/db'
import bcrypt from 'bcryptjs'

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
		email: email,
		newPassword: hashedPassword,
		user_id: userId,
	}
	const newUserPassword = await updateUserPassword(userData)
	res.status(200).json({ newUserPassword })

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

async function updateUserPassword(userData) {
	const { email, newPassword, user_id } = userData
	return [email, newPassword]
}
