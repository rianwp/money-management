import NextAuth, { AuthError } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import prisma from './db'
import { verifyPassword } from './utils'

export const { auth, handlers, signIn, signOut } = NextAuth({
	providers: [
		Credentials({
			async authorize(credentials) {
				if (!credentials) {
					return null
				}

				const user = await prisma.user.findFirst({
					where: {
						email: credentials.email || '',
					},
				})

				if (user) {
					const isPasswordValid = await verifyPassword(
						(credentials.password as string) || '',
						user?.password || ''
					)

					if (!isPasswordValid) return null

					return {
						id: user.id.toString(),
						name: user.name,
						email: user.email,
					}
				} else {
					return null
				}
			},
		}),
	],
	pages: {
		signIn: '/sign-in',
		newUser: '/sign-up',
		// signOut: '/sign-out',
	},
	session: { strategy: 'jwt' },
	secret: process.env.JWT_SECRET || '',
	callbacks: {
		async signIn({ user, account }) {
			if (account?.provider === 'credentials' && !user) {
				throw new Error('Invalid credentials')
			}
			return true
		},
		async redirect({ baseUrl }) {
			return baseUrl
		},
		async session({ session, token }) {
			const user = token.user as {
				id: string
				name: string
				email: string
			}

			if (user) {
				session.user.id = user.id
			}
			return session
		},
		async jwt({ token, user }) {
			if (user) {
				token.user = {
					id: user.id,
					name: user.name,
					email: user.email,
				}
			}
			return token
		},
	},
})

export const getCurrentUser = async () => {
	const session = await auth()
	if (!session) throw new AuthError('Unauthorized')
	return session.user
}
