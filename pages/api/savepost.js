import connection from '../../utils/db'

export default async function handler(req, res) {
	const { postTitle, postContent, email } = req.body

	const user = await findUserInDatabase(email)
	const userId = user.id
    
	const date = await getCurrentDate()
	const post = {
        postTitle: postTitle,
		postContent: postContent,
		user_id: userId,
		date: date,
	}

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


