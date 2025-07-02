import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'

interface IProgressCardProps {
	progress: number
	progressColor?: string
	isLoading: boolean
	children: React.ReactNode
}

const ProgressCardTitle = ({ children }: { children: React.ReactNode }) => (
	<h2 className="text-sm text-muted-foreground">{children}</h2>
)

const ProgressCardValue = ({
	children,
	color,
}: {
	children: React.ReactNode
	color?: string
}) => (
	<h3 className="text-2xl font-bold" style={{ color: color || undefined }}>
		{children}
	</h3>
)

const ProgressCardDescription = ({
	children,
}: {
	children: React.ReactNode
}) => <p className="text-sm text-muted-foreground">{children}</p>

const ProgressCard = ({
	progress,
	progressColor,
	isLoading,
	children,
}: IProgressCardProps) => {
	if (isLoading)
		return (
			<Card className="w-full h-full">
				<CardContent className="flex flex-col gap-y-2">
					<Skeleton className="h-4 w-1/3" />
					<Skeleton className="h-7 w-1/2" />
					<Skeleton className="h-4 w-2/3" />
					<Skeleton className="h-3 w-full rounded-full" />
				</CardContent>
			</Card>
		)
	return (
		<Card className="w-full h-full">
			<CardContent className="flex flex-col gap-y-2">
				{children}
				<Progress value={progress} indicatorColor={progressColor} />
			</CardContent>
		</Card>
	)
}

export {
	ProgressCardTitle,
	ProgressCardValue,
	ProgressCardDescription,
	ProgressCard,
}
