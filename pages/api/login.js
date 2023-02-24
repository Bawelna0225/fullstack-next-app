import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import connection from '../../utils/db'

export default async function handler(req, res) {
	const { email, password } = req.body

	// sprawdzenie, czy użytkownik istnieje w bazie danych
	const user = await fetchUserFromDatabase(email)

	if (!user) {
		res.status(401).json({ message: 'Nieprawidłowe dane logowania' })
		return
	}

	// sprawdzenie, czy hasło jest poprawne
	const passwordMatch = await bcrypt.compare(password, user.password)

	if (!passwordMatch) {
		res.status(401).json({ message: 'Nieprawidłowe dane logowania' })
		return
	}

	// wygenerowanie tokena uwierzytelniającego
	const token = jwt.sign({ userId: user.id }, 'tajny-klucz')

	// zwrócenie tokena i danych użytkownika w odpowiedzi
	res.status(200).json({ token, user })
}

async function fetchUserFromDatabase(email) {
	// pobranie użytkownika z bazy danych na podstawie adresu email

	const [users] = await connection.promise().query(`SELECT * FROM userdata`)

	return users.find((user) => user.email === email)
}
