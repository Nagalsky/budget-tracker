'use client'
import { authClient } from '@/lib/auth-client'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '../ui/button'

const SignInWithGoogle = () => {
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()
	const handleSignInWithGoogle = async () => {
		setIsLoading(true)
		await authClient.signIn.social(
			{
				provider: 'google',
			},
			{
				onSuccess: async () => {
					router.push('/')
					router.refresh()
					setIsLoading(false)
				},
			}
		)
	}
	return (
		<Button
			className='w-full'
			variant='outline'
			onClick={handleSignInWithGoogle}
			disabled={isLoading}
		>
			{isLoading && <Loader2 className='mr-2 animate-spin' />}Login with Google
		</Button>
	)
}

export default SignInWithGoogle
