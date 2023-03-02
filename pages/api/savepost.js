import connection from '../../utils/db'

export default async function handler(req, res) {
	const { postTitle, postContent, email } = req.body

	const user = await findUserInDatabase(email)
	const userId = user.id
    


}


async function findUserInDatabase(email) {
	// pobranie użytkownika z bazy danych na podstawie adresu email

	const [users] = await connection.promise().query(`SELECT * FROM userdata`)

	return users.find((user) => user.email === email)
}


