'use client'
import { User } from 'better-auth'
import { LogOutIcon, UserIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { signOut } from '../../lib/auth-client'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '../ui/dropdown-menu'

type Props = {
	user: User
}

const UserDropdown = ({ user }: Props) => {
	const router = useRouter()
	const [pending, setPending] = useState(false)

	const handleSignOut = async () => {
		try {
			setPending(true)
			await signOut({
				fetchOptions: {
					onSuccess: () => {
						router.push('/sign-in')
						router.refresh()
					},
				},
			})
		} catch (error) {
			console.error('Error signing out:', error)
		} finally {
			setPending(false)
		}
	}

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Avatar className='size-9 cursor-pointer'>
						<AvatarImage src={user.image || ''} alt={user.name} />
						<AvatarFallback>
							<UserIcon className='size-4' />
						</AvatarFallback>
					</Avatar>
				</DropdownMenuTrigger>
				<DropdownMenuContent>
					<DropdownMenuLabel>Logged in as {user.name}</DropdownMenuLabel>
					<DropdownMenuItem>{user.email}</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={handleSignOut} disabled={pending}>
						<LogOutIcon className='size-4' />
						Logout
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	)
}

export default UserDropdown
