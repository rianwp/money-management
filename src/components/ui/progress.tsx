'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'

import { cn } from '@/lib/utils'

interface IProgressProps
	extends React.ComponentProps<typeof ProgressPrimitive.Root> {
	indicatorColor?: string
}

function Progress({
	className,
	value,
	indicatorColor,
	...props
}: IProgressProps) {
	return (
		<ProgressPrimitive.Root
			data-slot="progress"
			className={cn(
				'bg-primary/20 relative h-2 w-full overflow-hidden rounded-full',
				className
			)}
			{...props}
		>
			<ProgressPrimitive.Indicator
				data-slot="progress-indicator"
				className="bg-primary h-full w-full flex-1 transition-all"
				style={{
					transform: `translateX(-${100 - (value || 0)}%)`,
					background: indicatorColor,
				}}
			/>
		</ProgressPrimitive.Root>
	)
}

export { Progress }
