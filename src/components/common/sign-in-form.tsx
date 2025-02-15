'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { authClient } from '@/lib/auth-client'
import { signInSchema } from '@/schemas/auth.schema'
import { AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Separator } from '../ui/separator'
import LoadingButton from './loading-button'

export default function SignInForm() {
	const router = useRouter()
	const [pendingCredentials, setPendingCredentials] = useState(false)
	const [pendingGoogle, setPendingGoogle] = useState(false)
	const [formError, setFormError] = useState<string | null>(null)

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const handleCredentialsSignIn = async (
		values: z.infer<typeof signInSchema>
	) => {
		await authClient.signIn.email(
			{
				email: values.email,
				password: values.password,
			},
			{
				onRequest: () => {
					setPendingCredentials(true)
				},
				onSuccess: async () => {
					router.push('/')
					router.refresh()
				},
				onError: () => {
					setFormError('Invalid credentials')
				},
			}
		)
		setPendingCredentials(false)
	}

	const handleSignInWithGoogle = async () => {
		await authClient.signIn.social(
			{
				provider: 'google',
			},
			{
				onRequest: () => {
					setPendingGoogle(true)
				},
				onSuccess: async () => {
					router.push('/')
					router.refresh()
				},
				onError: ctx => {
					setFormError(ctx.error.message ?? 'Something went wrong.')
				},
			}
		)
		setPendingGoogle(false)
	}

	return (
		<Card className='md:max-w-md mx-auto'>
			<CardHeader>
				<CardTitle className='text-3xl font-bold text-center'>
					Sign In
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleCredentialsSignIn)}
						className='space-y-6'
					>
						{formError && (
							<Alert variant='destructive'>
								<AlertCircle className='h-4 w-4' />
								<AlertTitle>Error</AlertTitle>
								<AlertDescription>{formError}</AlertDescription>
							</Alert>
						)}
						{['email', 'password'].map(field => (
							<FormField
								control={form.control}
								key={field}
								name={field as keyof z.infer<typeof signInSchema>}
								render={({ field: fieldProps }) => (
									<FormItem>
										<FormLabel>
											{field.charAt(0).toUpperCase() + field.slice(1)}
										</FormLabel>
										<FormControl>
											<Input
												type={field === 'password' ? 'password' : 'email'}
												placeholder={`Enter your ${field}`}
												{...fieldProps}
												autoComplete={
													field === 'password' ? 'current-password' : 'email'
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						))}
						<LoadingButton pending={pendingCredentials} className='w-full'>
							Sign in
						</LoadingButton>
					</form>
				</Form>
				<div className='mt-4'>
					<LoadingButton
						pending={pendingGoogle}
						onClick={handleSignInWithGoogle}
						className='w-full'
						variant='outline'
					>
						Login with Google
					</LoadingButton>
				</div>
				<Separator className='my-6' />

				<div className='text-center'>
					<Button asChild variant={'link'}>
						<Link href='/sign-up' className='text-primary hover:underline'>
							Don&apos;t have an account? Sign up
						</Link>
					</Button>
				</div>

				<Separator className='my-3' />

				<div className='text-center'>
					<Button asChild variant={'link'}>
						<Link href='/forgot-password'>Forgot password?</Link>
					</Button>
				</div>
			</CardContent>
		</Card>
	)
}
