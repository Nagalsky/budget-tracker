'use client'

import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { FC } from 'react'
import { Button, ButtonProps } from '../ui/button'

interface LoadingButtonProps extends Omit<ButtonProps, 'asChild'> {
	pending: boolean
	loadingText?: string
}

const LoadingButton: FC<LoadingButtonProps> = ({
	children,
	className,
	pending,
	loadingText = 'Processing...',
	...props
}) => {
	return (
		<Button className={cn(className)} disabled={pending} {...props}>
			{pending ? (
				<>
					{loadingText} <Loader2 className='animate-spin' />
				</>
			) : (
				children
			)}
		</Button>
	)
}

export default LoadingButton
