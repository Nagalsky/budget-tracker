import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { FC } from 'react'
import Navbar from './navbar'
import UserDropdown from './user-dropdown'

export const Header: FC = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session?.user) {
		redirect('/sign-in')
	}

	return (
		<header className='bg-gray/50 sticky top-0 z-30 py-4 shadow shadow-accent-foreground/10 backdrop-blur-xl dark:shadow-white/10'>
			<div className='container flex flex-wrap items-center gap-4'>
				<Link href={'/'}>Logo</Link>
				<Navbar />
				<UserDropdown user={session?.user} />
			</div>
		</header>
	)
}
