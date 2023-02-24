import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import connection from '../../utils/db'

export default async function handler(req, res) {
	const { name, email, password, confirmPassword } = req.body

	// sprawdzenie, czy użytkownik już istnieje w bazie danych
	const doesUserExist = await findUserInDatabase(email)

	if (doesUserExist) {
		res.status(401).json({ message: 'Użytkownik już istnieje' })
		return
	}

	// sprawdzenie, czy hasła jest identyczne
	const passwordMatch = password === confirmPassword

	if (!passwordMatch) {
		res.status(401).json({ message: 'Hasła nie są identyczne' })
		return
	}

	// wygenerowanie tokena uwierzytelniającego
	res.status(200).json({ message: "Nice" })
}

async function findUserInDatabase(email) {
	// pobranie użytkownika z bazy danych na podstawie adresu email

	const [users] = await connection.promise().query(`SELECT * FROM userdata`)

	return users.find((user) => user.email === email)
}

async function saveUserInDatabase(name, email, cryptedPassword) {
	// zapisanie użytkownika w bazie danych

	
}
