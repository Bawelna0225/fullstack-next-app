import bcrypt from 'bcryptjs'
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
	const hashedPassword = await hashPassword(password)
	const date = await getCurrentDate()
	const user = {
		name: name,
		email: email,
		password: hashedPassword,
		date: date,
	}
	const newUserEmail = await saveUserToDatabase(user)
	// wygenerowanie tokena uwierzytelniającego
	res.status(200).json({ newUserEmail })
}
async function hashPassword(password) {
	const saltRounds = 10
	const hashedPassword = await bcrypt.hash(password, saltRounds)
	return hashedPassword
}

async function getCurrentDate() {
	const currentDate = new Date()

	const year = currentDate.getFullYear()
	const month = String(currentDate.getMonth() + 1).padStart(2, '0')
	const day = String(currentDate.getDate()).padStart(2, '0')

	const formattedDate = `${year}-${month}-${day}`

	return formattedDate
}

async function findUserInDatabase(email) {
	// pobranie użytkownika z bazy danych na podstawie adresu email

	const [users] = await connection.promise().query(`SELECT * FROM userdata`)

	return users.find((user) => user.email === email)
}

async function saveUserToDatabase(user) {
	const { name, email, password, date } = user

	const sql = `INSERT INTO userdata (name, email, password, date_joined) VALUES (?, ?, ?, ?)`
	const sql2 = `INSERT INTO userdetails (introduction, github, website) VALUES ('','','')`
	const values = [name, email, password, date]

	try {
		const [result] = await connection.promise().execute(sql, values)
		const [result2] = await connection.promise().execute(sql2)
		return email
	} catch (error) {
		console.error(`Error saving user to database: ${error}`)
		return null
	}
}
