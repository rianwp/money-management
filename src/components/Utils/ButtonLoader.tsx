import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface IButtonLoaderProps {
	className: string
	isLoading: boolean
}

const ButtonLoader = ({ className, isLoading }: IButtonLoaderProps) => {
	if (!isLoading) return null
	return <Loader2 className={cn('h-5 w-5 animate-spin', className)} />
}

export default ButtonLoader
