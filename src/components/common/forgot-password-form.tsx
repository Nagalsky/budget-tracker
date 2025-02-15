'use client'

import LoadingButton from '@/components/common/loading-button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { authClient } from '@/lib/auth-client'
import { forgotPasswordSchema } from '@/schemas/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export default function ForgotPasswordForm() {
	const [pending, setPending] = useState(false)
	const [formError, setFormError] = useState<string | null>(null)
	const [success, setSuccess] = useState(false)

	const form = useForm<z.infer<typeof forgotPasswordSchema>>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: '',
		},
	})

	const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
		await authClient.forgetPassword(
			{
				email: values.email,
				redirectTo: '/reset-password',
			},
			{
				onRequest: () => {
					setPending(true)
					setFormError(null)
				},
				onSuccess: () => {
					setSuccess(true)
				},
				onError: error => {
					setFormError(error.error.message ?? 'Something went wrong')
				},
			}
		)
		setPending(false)
	}

	if (success) {
		return (
			<Card className='md:max-w-md mx-auto'>
				<CardContent className='pt-6'>
					<Alert className='mb-4'>
						<AlertTitle>Check your email</AlertTitle>
						<AlertDescription>
							We have sent you a password reset link. Please check your email.
						</AlertDescription>
					</Alert>
					<Link href='/sign-in' className='text-primary hover:underline'>
						Back to sign in
					</Link>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className='md:max-w-md mx-auto'>
			<CardHeader>
				<CardTitle className='text-3xl font-bold text-center'>
					Forgot Password
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
						{formError && (
							<Alert variant='destructive'>
								<AlertCircle className='h-4 w-4' />
								<AlertTitle>Error</AlertTitle>
								<AlertDescription>{formError}</AlertDescription>
							</Alert>
						)}
						<FormField
							control={form.control}
							name='email'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type='email'
											placeholder='Enter your email'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<LoadingButton pending={pending} className='w-full'>
							Send Reset Link
						</LoadingButton>
					</form>
				</Form>
				<div className='mt-4 text-center'>
					<Link href='/sign-in' className='text-primary hover:underline'>
						Back to sign in
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
