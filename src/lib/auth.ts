import { betterAuth, BetterAuthOptions } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import prisma from './prisma'
import { resend } from './resend'

export const auth = betterAuth({
	database: prismaAdapter(prisma, {
		provider: 'postgresql',
	}),
	session: {
		expiresIn: 60 * 60 * 24 * 7,
		updateAge: 60 * 60 * 24,
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60,
		},
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
		},
	},
	plugins: [nextCookies()],
	emailAndPassword: {
		enabled: true,
		sendResetPassword: async ({ user, url }) => {
			await resend.emails.send({
				from: process.env.RESEND_EMAIL_FROM!,
				to: user.email,
				subject: 'Reset your password',
				html: `Click <a href="${url}">here</a> to reset your password.`,
			})
		},
	},
} satisfies BetterAuthOptions)

export type Session = typeof auth.$Infer.Session
