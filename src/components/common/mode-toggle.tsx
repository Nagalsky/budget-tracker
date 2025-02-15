'use client'

import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { useCallback } from 'react'

const ModeToggle = () => {
	const { setTheme, resolvedTheme } = useTheme()

	const toggleTheme = useCallback(() => {
		setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
	}, [resolvedTheme, setTheme])

	return (
		<Button
			variant='outline'
			size='icon'
			className='group/toggle'
			onClick={toggleTheme}
		>
			<SunIcon className='hidden [html.dark_&]:block' />
			<MoonIcon className='hidden [html.light_&]:block' />
			<span className='sr-only'>Toggle theme</span>
		</Button>
	)
}

export default ModeToggle
