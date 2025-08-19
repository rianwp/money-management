import { cn } from '@/lib/utils'
import Image from 'next/image'

interface IEmptyStateWrapperProps {
	isEmpty: boolean
	children: React.ReactNode
	message: string
	className?: string
}

const EmptyStateWrapper = ({
	isEmpty,
	children,
	message,
	className,
}: IEmptyStateWrapperProps) => {
	if (!isEmpty) return <>{children}</>
	return (
		<div
			className={cn(
				'w-full text-center flex justify-center items-center flex-col gap-y-2',
				className
			)}
		>
			<div className="w-[200px]">
				<Image
					src="/assets/img/empty-state.webp"
					alt={message}
					width={400}
					height={400}
				/>
			</div>
			<p className="text-lg font-light text-gray-500">{message}</p>
		</div>
	)
}

export default EmptyStateWrapper
