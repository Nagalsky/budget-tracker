import { z } from 'zod'

const getPasswordSchema = (type: 'password' | 'confirmPassword') =>
	z
		.string()
		.min(8, { message: `${type} must be atleast 8 characters` })
		.max(32, { message: `${type} can not exceed 32 characters` })

const getEmailSchema = () => z.string().email({ message: 'Invalid email' })

const getNameSchema = () =>
	z
		.string()
		.min(1, { message: 'Name is required' })
		.max(50, 'Name must be less than 50 characters')

export const signUpSchema = z.object({
	name: getNameSchema(),
	email: getEmailSchema(),
	password: getPasswordSchema('password'),
})

export const signInSchema = z.object({
	email: getEmailSchema(),
	password: getPasswordSchema('password'),
})

export const resetPasswordSchema = z
	.object({
		password: getPasswordSchema('password'),
		confirmPassword: getPasswordSchema('confirmPassword'),
		token: z.string(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	})

export const forgotPasswordSchema = z.object({
	email: getEmailSchema(),
})
