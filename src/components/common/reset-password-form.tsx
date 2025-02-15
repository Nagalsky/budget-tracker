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
import { resetPasswordSchema } from '@/schemas/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export default function ResetPasswordForm() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const token = searchParams.get('token')

	const [pending, setPending] = useState(false)
	const [formError, setFormError] = useState<string | null>(null)

	const form = useForm<z.infer<typeof resetPasswordSchema>>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: '',
			confirmPassword: '',
		},
	})

	const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
		if (!token) {
			setFormError('Invalid reset token')
			return
		}

		await authClient.resetPassword(
			{
				token,
				newPassword: values.password,
			},
			{
				onRequest: () => {
					setPending(true)
					setFormError(null)
				},
				onSuccess: () => {
					router.push('/sign-in?reset=success')
				},
				onError: error => {
					setFormError(error.error.message ?? 'Something went wrong')
				},
			}
		)
		setPending(false)
	}

	return (
		<Card className='md:max-w-md mx-auto'>
			<CardHeader>
				<CardTitle className='text-3xl font-bold text-center'>
					Reset Password
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
							name='password'
							render={({ field }) => (
								<FormItem>
									<FormLabel>New Password</FormLabel>
									<FormControl>
										<Input
											type='password'
											placeholder='Enter new password'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name='confirmPassword'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Confirm Password</FormLabel>
									<FormControl>
										<Input
											type='password'
											placeholder='Confirm new password'
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<LoadingButton pending={pending} className='w-full'>
							Reset Password
						</LoadingButton>
					</form>
				</Form>
			</CardContent>
		</Card>
	)
}
