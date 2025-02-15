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
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24, // 1 day (every 1 day the session expiration is updated)
		cookieCache: {
			enabled: true,
			maxAge: 5 * 60, // Cache duration in seconds
		},
	},
	// user: {
	// 	additionalFields: {
	// 		premium: {
	// 			type: 'boolean',
	// 			required: false,
	// 		},
	// 	},
	// 	changeEmail: {
	// 		enabled: true,
	// 		sendChangeEmailVerification: async ({ newEmail, url }) => {
	// 			await sendEmail({
	// 				to: newEmail,
	// 				subject: 'Verify your email change',
	// 				text: `Click the link to verify: ${url}`,
	// 			})
	// 		},
	// 	},
	// },
	// socialProviders: {
	// 	github: {
	// 		clientId: process.env.GITHUB_CLIENT_ID as string,
	// 		clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
	// 	},
	// },
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
	// emailAndPassword: {
	// 	enabled: true,
	// 	sendResetPassword: async ({ user, url }) => {
	// 		const resend = new Resend(process.env.RESEND_API_KEY)
	// 		await resend.emails.send({
	// 			from: process.env.RESEND_EMAIL_FROM!, // Using the testing email
	// 			to: user.email,
	// 			subject: 'Reset your password',
	// 			html: `
	//         <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
	//           <h1 style="color: #333; text-align: center;">Reset Your Password</h1>
	//           <p style="color: #666; font-size: 16px;">Click the button below to reset your password. This link will expire in 1 hour.</p>
	//           <div style="text-align: center; margin: 30px 0;">
	//             <a href="${url}"
	//                style="background: #0070f3;
	//                       color: white;
	//                       padding: 12px 24px;
	//                       text-decoration: none;
	//                       border-radius: 5px;
	//                       display: inline-block;">
	//               Reset Password
	//             </a>
	//           </div>
	//           <p style="color: #666; font-size: 14px; text-align: center;">
	//             If you didn't request this password reset, you can safely ignore this email.
	//           </p>
	//         </div>
	//       `,
	// 		})
	// 	},
	// 	// requireEmailVerification: true,
	// 	// sendResetPassword: async ({ user, url }) => {
	// 	// 	await sendEmail({
	// 	// 		to: user.email,
	// 	// 		subject: 'Reset your password',
	// 	// 		text: `Click the link to reset your password: ${url}`,
	// 	// 	})
	// 	// },
	// },
	// emailVerification: {
	// 	sendOnSignUp: true,
	// 	autoSignInAfterVerification: true,
	// 	sendVerificationEmail: async ({ user, token }) => {
	// 		const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/auth/verify-email?token=${token}&callbackURL=${process.env.EMAIL_VERIFICATION_CALLBACK_URL}`
	// 		await sendEmail({
	// 			to: user.email,
	// 			subject: 'Verify your email address',
	// 			text: `Click the link to verify your email: ${verificationUrl}`,
	// 		})
	// 	},
	// },
} satisfies BetterAuthOptions)

export type Session = typeof auth.$Infer.Session
