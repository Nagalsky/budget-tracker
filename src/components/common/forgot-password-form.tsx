'use client'

import { forgetPassword } from '@/actions/auth.actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'
import Form from 'next/form'
import Link from 'next/link'
import { useActionState } from 'react'
import { Label } from '../ui/label'
import SubmitButton from './submit-button'

export default function ForgotPasswordForm() {
	const [state, action] = useActionState(forgetPassword, undefined)

	if (state?.success) {
		return (
			<Card className='md:max-w-md mx-auto'>
				<CardContent className='pt-6'>
					<Alert className='mb-4'>
						<AlertTitle>Check your email</AlertTitle>
						<AlertDescription>
							We have sent you a password reset link. Please check your email.
						</AlertDescription>
					</Alert>
					<div className='mt-4 text-center text-sm'>
						<Link href='/sign-up' className='underline underline-offset-4'>
							Back to sign in
						</Link>
					</div>
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
				<Form action={action} className='space-y-6'>
					{state?.message && (
						<Alert variant='destructive'>
							<AlertCircle className='h-4 w-4' />
							<AlertTitle>Error</AlertTitle>
							<AlertDescription>{state.message}</AlertDescription>
						</Alert>
					)}

					<div className='flex flex-col gap-2'>
						<Label
							htmlFor='email'
							className={cn(state?.errors?.email && 'text-destructive')}
						>
							Email
						</Label>
						<Input
							id='email'
							name='email'
							type='email'
							placeholder='john@example.com'
							className={cn(state?.errors?.email && 'border-destructive')}
							defaultValue={state?.data?.email}
						/>
						{state?.errors?.email && (
							<p className='text-destructive'>{state.errors.email}</p>
						)}
					</div>

					<SubmitButton className='w-full'>Send reset link</SubmitButton>
				</Form>
				<div className='mt-4 text-center text-sm'>
					<Link href='/sign-up' className='underline underline-offset-4'>
						Back to sign in
					</Link>
				</div>
			</CardContent>
		</Card>
	)
}
