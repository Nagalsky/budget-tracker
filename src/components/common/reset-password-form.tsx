'use client'

import { resetPassword } from '@/actions/auth.actions'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'
import Form from 'next/form'
import { useRouter, useSearchParams } from 'next/navigation'
import { useActionState, useEffect } from 'react'
import { Label } from '../ui/label'
import SubmitButton from './submit-button'

export default function ResetPasswordForm() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const token = searchParams.get('token')
	const [state, action] = useActionState(resetPassword, undefined)

	useEffect(() => {
		if (state?.redirect) {
			router.push(state?.redirect)
		}
	}, [state?.redirect, router])

	if (!token) {
		return (
			<Card className='md:max-w-md mx-auto'>
				<CardContent className='pt-6'>
					<Alert variant='destructive'>
						<AlertCircle className='h-4 w-4' />
						<AlertTitle>Error</AlertTitle>
						<AlertDescription>Invalid reset token</AlertDescription>
					</Alert>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card className='md:max-w-md mx-auto'>
			<CardHeader>
				<CardTitle className='text-3xl font-bold text-center'>
					Reset Password
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

					<input type='hidden' name='token' value={token} />

					<div className='flex flex-col gap-2'>
						<Label
							htmlFor='password'
							className={cn(state?.errors?.password && 'text-destructive')}
						>
							New Password
						</Label>
						<Input
							id='password'
							name='password'
							type='password'
							placeholder='Enter new password'
							className={cn(state?.errors?.password && 'border-destructive')}
							defaultValue={state?.data?.password}
						/>
						{state?.errors?.password && (
							<p className='text-destructive'>{state.errors.password}</p>
						)}
					</div>

					<div className='flex flex-col gap-2'>
						<Label
							htmlFor='confirmPassword'
							className={cn(
								state?.errors?.confirmPassword && 'text-destructive'
							)}
						>
							Confirm Password
						</Label>
						<Input
							id='confirmPassword'
							name='confirmPassword'
							type='password'
							placeholder='Confirm new password'
							className={cn(
								state?.errors?.confirmPassword && 'border-destructive'
							)}
							defaultValue={state?.data?.confirmPassword}
						/>
						{state?.errors?.confirmPassword && (
							<p className='text-destructive'>{state.errors.confirmPassword}</p>
						)}
					</div>

					<SubmitButton className='w-full'>Reset Password</SubmitButton>
				</Form>
			</CardContent>
		</Card>
	)
}
