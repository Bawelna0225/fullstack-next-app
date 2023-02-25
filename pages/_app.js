import '@/styles/globals.css'
import '@/styles/style.css'
import { SessionProvider } from 'next-auth/react'

export default function App({ Component, pageProps }) {
	return (
		<SessionProvider session={pageProps.session}>
			<Component {...pageProps} />
		</SessionProvider>
	)
}
