'use client'

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

import Link from 'next/link'

import { signUpSchema } from '@/schemas/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { authClient } from '../../lib/auth-client'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Separator } from '../ui/separator'
import {
	default as LoadingButton,
	default as SubmitButton,
} from './loading-button'

export default function SignUpForm() {
	const router = useRouter()
	const [pending, setPending] = useState(false)
	const [formError, setFormError] = useState<string | null>(null)
	const [pendingGoogle, setPendingGoogle] = useState(false)

	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	})

	const onSubmit = async (values: z.infer<typeof signUpSchema>) => {
		await authClient.signUp.email(
			{
				email: values.email,
				password: values.password,
				name: values.name,
			},
			{
				onRequest: () => {
					setPending(true)
				},
				onSuccess: () => {
					router.push('/sign-in')
					router.refresh()
				},
				onError: error => {
					setFormError(error.error.message)
				},
			}
		)
		setPending(false)
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
					Create Account
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

						{['name', 'email', 'password'].map(field => (
							<FormField
								control={form.control}
								key={field}
								name={field as keyof z.infer<typeof signUpSchema>}
								render={({ field: fieldProps }) => (
									<FormItem>
										<FormLabel>
											{field.charAt(0).toUpperCase() + field.slice(1)}
										</FormLabel>
										<FormControl>
											<Input
												type={
													field.includes('password')
														? 'password'
														: field === 'email'
														? 'email'
														: 'text'
												}
												placeholder={`Enter your ${field}`}
												{...fieldProps}
												autoComplete='off'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						))}
						<SubmitButton pending={pending} className='w-full'>
							Sign up
						</SubmitButton>
					</form>
				</Form>
				<div className='mt-4'>
					<LoadingButton
						pending={pendingGoogle}
						onClick={handleSignInWithGoogle}
						className='w-full'
						variant='outline'
					>
						Signin with Google
					</LoadingButton>
				</div>
				<Separator className='my-6' />
				<div className='text-center'>
					<Link href='/sign-in' className='text-primary hover:underline'>
						Already have an account? Sign in
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
