'use client'
import { MenuIcon } from 'lucide-react'
import Link from 'next/link'
import { FC, useState } from 'react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetTitle,
	SheetTrigger,
} from '../ui/sheet'
import ModeToggle from './mode-toggle'

const navItems = [
	{
		title: 'Blog',
		href: 'blog',
	},
	{
		title: 'About',
		href: '#about',
	},
	{
		title: 'Contact',
		href: '#contact',
	},
]

const Navbar: FC = () => {
	const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false)
	return (
		<div className='ml-auto flex flex-col md:flex-row md:items-center'>
			<nav className='hidden gap-x-8 md:flex md:flex-row'>
				{navItems.map((item, index) => (
					<Link href={`/${item.href}`} key={index}>
						{item.title}
					</Link>
				))}
			</nav>
			<Separator orientation='vertical' className='mx-6 hidden h-5 md:block' />
			<div className='hidden md:block'>
				<ModeToggle />
			</div>
			<Sheet open={isMenuOpened} onOpenChange={setIsMenuOpened}>
				<SheetTrigger asChild>
					<Button variant='outline' size='icon' className='md:hidden'>
						<MenuIcon className='h-6 w-6' />
						<span className='sr-only'>Toggle navigation menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side='left' className='px-6'>
					<SheetTitle />
					<SheetDescription />
					<nav className='flex flex-col gap-y-8'>
						{navItems.map((item, index) => (
							<Link
								href={`/${item.href}`}
								key={index}
								onClick={() => setIsMenuOpened(false)}
							>
								{item.title}
							</Link>
						))}
					</nav>
					<Separator className='my-6' />
					<div className='flex items-center justify-between gap-3 md:hidden'>
						<p>Switch Theme</p>
						<ModeToggle />
					</div>
				</SheetContent>
			</Sheet>
		</div>
	)
}

export default Navbar
