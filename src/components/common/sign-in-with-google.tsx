'use client'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'

const SignInWithGoogle = () => {
	const router = useRouter()
	const handleSignInWithGoogle = async () => {
		await authClient.signIn.social(
			{
				provider: 'google',
			},
			{
				onSuccess: async () => {
					router.push('/')
					router.refresh()
				},
			}
		)
	}
	return (
		<Button
			className='w-full'
			variant='outline'
			onClick={handleSignInWithGoogle}
		>
			Login with Google
		</Button>
	)
}

export default SignInWithGoogle
