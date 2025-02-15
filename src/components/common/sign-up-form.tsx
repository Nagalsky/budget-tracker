'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import Link from 'next/link'

import { signUp } from '@/actions/auth.actions'
import { cn } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'
import Form from 'next/form'
import { useRouter } from 'next/navigation'
import { useActionState, useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import SignInWithGoogle from './sign-in-with-google'
import SubmitButton from './submit-button'

const FORM_FIELDS = [
	{
		label: 'Name',
		name: 'name' as const,
		type: 'text',
		placeholder: 'John Doe',
	},
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

export default function SignUpForm() {
	const router = useRouter()
	const [state, action] = useActionState(signUp, undefined)

	useEffect(() => {
		if (
			state &&
			Object.keys(state?.errors ?? {}).length === 0 &&
			!state.message
		) {
			router.push('/')
		}
	}, [router, state])

	console.log('state: ', state)

	return (
		<Card className='md:max-w-md mx-auto'>
			<CardHeader>
				<CardTitle className='text-3xl font-bold text-center'>
					Create Account
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
							<Label
								htmlFor={name}
								className={cn(state?.errors?.[name] && 'text-destructive')}
							>
								{label}
							</Label>
							<Input
								id={name}
								name={name}
								type={type}
								placeholder={placeholder}
								className={cn(state?.errors?.[name] && 'border-destructive')}
								defaultValue={state?.data?.[name]}
							/>
							{state?.errors?.[name] && (
								<p className='text-destructive'>{state.errors[name][0]}</p>
							)}
						</div>
					))}

					<SubmitButton className='w-full'>Sign Up</SubmitButton>
				</Form>

				<Separator className='my-5' />

				<SignInWithGoogle />

				<div className='mt-4 text-center text-sm'>
					<Link href='/sign-in' className='text-primary hover:underline'>
						Already have an account? Sign in
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
