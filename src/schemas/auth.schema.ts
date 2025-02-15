import { z } from 'zod'

const getPasswordSchema = () =>
	z
		.string()
		.min(8, { message: 'Password must be atleast 8 characters' })
		.max(32, { message: 'Password can not exceed 32 characters' })

const getEmailSchema = () =>
	z
		.string()
		.min(1, { message: 'Field is required' })
		.email({ message: 'Invalid email' })

const getNameSchema = () =>
	z
		.string()
		.min(1, { message: 'Name is required' })
		.max(50, 'Name must be less than 50 characters')

export const signUpSchema = z.object({
	name: getNameSchema(),
	email: getEmailSchema(),
	password: getPasswordSchema(),
})

export const signInSchema = z.object({
	email: getEmailSchema(),
	password: getPasswordSchema(),
})

export const resetPasswordSchema = z
	.object({
		password: getPasswordSchema(),
		confirmPassword: getPasswordSchema(),
		token: z.string(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	})

export const forgotPasswordSchema = z.object({
	email: getEmailSchema(),
})
