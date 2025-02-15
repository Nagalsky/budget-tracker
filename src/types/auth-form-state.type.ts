export type SignInFormState =
	| {
			data: {
				email?: string
				password?: string
			}
			errors: {
				email?: string[]
				password?: string[]
			}
			message?: string
	  }
	| undefined

export type SignUpFormState =
	| {
			data: {
				name?: string
				email?: string
				password?: string
			}
			errors: {
				name?: string[]
				email?: string[]
				password?: string[]
			}
			message?: string
	  }
	| undefined

export type ForgotPasswordFormState =
	| {
			data: {
				email?: string
			}
			errors: {
				email?: string[]
			}
			message?: string
	  }
	| undefined

export type ResetPasswordFormState =
	| {
			data: {
				password?: string
				confirmPassword?: string
			}
			errors: {
				password?: string[]
				confirmPassword?: string[]
			}
			message?: string
	  }
	| undefined
