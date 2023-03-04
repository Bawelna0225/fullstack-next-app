import connection from '../../utils/db'
import bcrypt from 'bcryptjs'

export default async function handler(req, res) {
	const { email, password, confirmPassword } = req.body

	const user = await findUserInDatabase(email)

	if (!user) {
		res.status(401).json({ message: "Something is wrong, You don't exist" })
		return
	}

	const passwordMatch = password === confirmPassword

	if (!passwordMatch) {
		res.status(401).json({ message: "Passwords Don't Match" })
		return
	}
	const hashedPassword = await hashPassword(password)
    
	const userData = {
		email: email,
		newPassword: hashedPassword,
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
	const { email, newPassword } = userData
	const sql = `UPDATE userdata SET password = ? WHERE email = ?`
	const values = [newPassword, email]
	try {
		const [result] = await connection.promise().execute(sql, values)
		return [email, newPassword]
	} catch (error) {
		console.error(`Error saving user to database: ${error}`)
		return null
	}
}
