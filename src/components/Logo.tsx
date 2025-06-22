import { cn } from '@/lib/utils'
import { Wallet } from 'lucide-react'

interface ILogoProps {
	size?: 'lg' | 'sm' | 'responsive'
	className?: string
}

const Logo = ({ size = 'lg', className }: ILogoProps) => {
	const sizeVariant = {
		lg: {
			parent: 'size-12 ',
			child: 'size-8',
		},
		sm: {
			parent: 'size-7',
			child: 'size-4',
		},
		responsive: {
			parent: 'lg:size-12 size-8',
			child: 'lg:size-8 size-5',
		},
	}
	const getSize = () => sizeVariant[size]
	return (
		<div
			className={cn(
				getSize().parent,
				className,
				'bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center'
			)}
		>
			<Wallet className={cn(getSize().child, ' text-white')} />
		</div>
	)
}

export default Logo
