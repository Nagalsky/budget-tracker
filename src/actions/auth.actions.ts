'use server'

import { auth } from '@/lib/auth'
import { authClient } from '@/lib/auth-client'
import {
	forgotPasswordSchema,
	resetPasswordSchema,
	signInSchema,
	signUpSchema,
} from '@/schemas/auth.schema'
import type {
	ForgotPasswordFormState,
	ResetPasswordFormState,
	SignInFormState,
	SignUpFormState,
} from '@/types/auth-form-state.type'

export async function signIn(
	state: SignInFormState,
	formData: FormData
): Promise<SignInFormState> {
	const validatedFields = signInSchema.safeParse(
		Object.fromEntries(formData.entries())
	)

	if (!validatedFields.success) {
		return {
			data: Object.fromEntries(formData.entries()),
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	try {
		const { email, password } = validatedFields.data

		const result = await auth.api.signInEmail({
			body: {
				email,
				password,
				redirect: true,
				callbackURL: '/',
			},
		})

		if (result) {
			return {
				data: Object.fromEntries(formData.entries()),
				errors: {},
				redirect: result.url,
			}
		}
	} catch {
		return {
			data: Object.fromEntries(formData.entries()),
			errors: {},
			message: 'Invalid credentials',
		}
	}
}

export async function signUp(
	state: SignUpFormState,
	formData: FormData
): Promise<SignUpFormState> {
	const validatedFields = signUpSchema.safeParse(
		Object.fromEntries(formData.entries())
	)

	if (!validatedFields.success) {
		return {
			data: Object.fromEntries(formData.entries()),
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	try {
		const { email, password, name } = validatedFields.data

		const result = await auth.api.signUpEmail({
			body: {
				name,
				email,
				password,
				redirect: true,
				callbackURL: '/',
			},
		})

		if (result) {
			return {
				data: Object.fromEntries(formData.entries()),
				errors: {},
			}
		}
	} catch {
		return {
			data: Object.fromEntries(formData.entries()),
			errors: {},
			message: 'User already exists',
		}
	}
}

export async function forgetPassword(
	state: ForgotPasswordFormState,
	formData: FormData
): Promise<ForgotPasswordFormState> {
	const validatedFields = forgotPasswordSchema.safeParse(
		Object.fromEntries(formData.entries())
	)

	if (!validatedFields.success) {
		return {
			data: Object.fromEntries(formData.entries()),
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	try {
		const { email } = validatedFields.data

		const result = await authClient.forgetPassword({
			email,
			redirectTo: '/reset-password',
		})

		if (result) {
			return {
				data: Object.fromEntries(formData.entries()),
				errors: {},
				success: true,
			}
		}
	} catch {
		return {
			data: Object.fromEntries(formData.entries()),
			errors: {},
			message: 'Invalid credentials',
		}
	}
}

export async function resetPassword(
	state: ResetPasswordFormState,
	formData: FormData
): Promise<ResetPasswordFormState> {
	const validatedFields = resetPasswordSchema.safeParse(
		Object.fromEntries(formData.entries())
	)

	if (!validatedFields.success) {
		return {
			data: Object.fromEntries(formData.entries()),
			errors: validatedFields.error.flatten().fieldErrors,
		}
	}

	try {
		const { password, token } = validatedFields.data

		const result = await auth.api.resetPassword({
			body: {
				token,
				newPassword: password,
				redirect: true,
				callbackURL: '/sign-in?reset=success',
			},
		})

		if (result) {
			return {
				data: Object.fromEntries(formData.entries()),
				errors: {},
				redirect: '/sign-in?reset=success',
			}
		}
	} catch {
		return {
			data: Object.fromEntries(formData.entries()),
			errors: {},
			message: 'Invalid reset token or password',
		}
	}
}
