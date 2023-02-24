import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import connection from '../../../utils/db'

const authOptions = {
	session: {
		strategy: 'jwt',
	},
	providers: [
		CredentialsProvider({
			type: 'credentials',
			credentials: {},
			async authorize(credentials, req) {
				const { email, password } = credentials
				// perform you login logic
				// find out user from db
				
                async function fetchUserFromDatabase(email) {
					// pobranie użytkownika z bazy danych na podstawie adresu email

					const [users] = await connection.promise().query(`SELECT * FROM userdata`)

					return users.find((user) => user.email === email)
				}

				const user = await fetchUserFromDatabase(email)

				if (!user) {
					throw new Error("invalid credentials");
				}

				// sprawdzenie, czy hasło jest poprawne
				const passwordMatch = await bcrypt.compare(password, user.password)

				if (!passwordMatch) {
					throw new Error("invalid credentials");
				}
				return {
					id: user.id,
					name: user.name,
					email: user.email,
				}
			},
		}),
	],
	pages: {
		signIn: '/auth/signin',
		// error: '/auth/error',
		// signOut: '/auth/signout'
	},
	callbacks: {
		jwt(params) {
			// update token
			if (params.user?.role) {
				params.token.role = params.user.role
			}
			// return final_token
			return params.token
		},
	},
}

export default NextAuth(authOptions)
