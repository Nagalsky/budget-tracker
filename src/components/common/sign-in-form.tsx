'use client'

import { AlertCircle } from 'lucide-react'
import Link from 'next/link'

import { signIn } from '@/actions/auth.actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import Form from 'next/form'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect } from 'react'
import { Separator } from '../ui/separator'
import SignInWithGoogle from './sign-in-with-google'
import SubmitButton from './submit-button'

const FORM_FIELDS = [
	{
		label: 'Email',
		name: 'email' as const,
		type: 'email',
		placeholder: 'john@example.com',
	},
	{
		label: 'Password',
		name: 'password' as const,
		type: 'password',
		placeholder: 'Enter your password',
	},
]

export default function SignInForm() {
	const router = useRouter()
	const [state, action] = useActionState(signIn, undefined)

	useEffect(() => {
		if (state?.redirect) {
			router.push(state.redirect)
		}
	}, [state?.redirect, router])

	return (
		<Card className='md:max-w-md mx-auto'>
			<CardHeader>
				<CardTitle className='text-3xl font-bold text-center'>
					Sign In
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Form action={action} className='space-y-6'>
					{state?.message && (
						<Alert variant='destructive'>
							<AlertCircle className='h-4 w-4' />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{state.message}</AlertDescription>
						</Alert>
					)}

					{FORM_FIELDS.map(({ label, name, type, placeholder }) => (
						<div key={name} className='flex flex-col gap-2'>
							<div className='flex items-center'>
								<Label
									htmlFor={name}
									className={cn(state?.errors?.[name] && 'text-destructive')}
								>
									{label}
								</Label>
								{name === 'password' && (
									<Link
										href='/forgot-password'
										className='ml-auto inline-block text-sm underline-offset-4 hover:underline'
									>
										Forgot your password?
									</Link>
								)}
							</div>
							<Input
								id={name}
								name={name}
								type={type}
								placeholder={placeholder}
								className={cn(state?.errors?.[name] && 'border-destructive')}
								defaultValue={state?.data?.[name]}
							/>
							{state?.errors?.[name] && (
								<p className='text-destructive'>{state.errors[name]}</p>
							)}
						</div>
					))}

					<SubmitButton className='w-full'>Sign In</SubmitButton>
				</Form>

				<Separator className='my-5' />

				<SignInWithGoogle />

				<div className='mt-4 text-center text-sm'>
					Don&apos;t have an account?{' '}
					<Link href='/sign-up' className='underline underline-offset-4'>
						Sign up
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
