import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { Button, IButtonProps } from '../ui/button'

interface IButtonLoaderProps extends IButtonProps {
	className?: string
	isLoading?: boolean
	children?: React.ReactNode
	icon?: React.ReactNode
}

const ButtonLoader = ({
	className,
	isLoading = false,
	children,
	icon,
	...props
}: IButtonLoaderProps) => {
	return (
		<Button {...props} className={cn(className)} disabled={isLoading}>
			{isLoading ? (
				<Loader2 className={cn('h-5 w-5 animate-spin')} />
			) : (
				icon || null
			)}
			{children ? <span>{children}</span> : null}
		</Button>
	)
}

export default ButtonLoader
