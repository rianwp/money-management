/* eslint-disable @typescript-eslint/no-unused-vars */
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import prisma from './db'
import { verifyPassword } from './utils'

export const { auth, handlers, signIn, signOut } = NextAuth({
	providers: [
		Credentials({
			async authorize(credentials) {
				try {
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
				} catch (error) {
					throw new Error(
						JSON.stringify({ errors: 'Authorize error', status: false })
					)
				}
			},
		}),
	],
	pages: {
		signIn: '/sign-in',
		newUser: '/sign-up',
		signOut: '/sign-out',
	},
	session: { strategy: 'jwt' },
	secret: process.env.JWT_SECRET || '',
	callbacks: {
		async signIn(userDetail) {
			if (Object.keys(userDetail).length === 0) {
				return false
			}
			return true
		},
		async redirect({ baseUrl }) {
			return baseUrl
		},
		async session({ session, token }) {
			if (session.user?.name) session.user.name = token.name
			return session
		},
		async jwt({ token, user }) {
			if (user) token.user = user
			return token
		},
	},
})
