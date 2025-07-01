import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'

interface IProgressCardProps {
	title: string
	value: string
	progress: number
	description: string
	textColor?: string
	progressColor?: string
	isLoading: boolean
}

const ProgressCard = ({
	title,
	value,
	progress,
	description,
	progressColor,
	textColor,
	isLoading,
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
				<h2 className="text-sm text-muted-foreground">{title}</h2>
				<h3
					className="text-2xl font-bold"
					style={{ color: textColor || undefined }}
				>
					{value}
				</h3>
				<p className="text-sm text-muted-foreground">{description}</p>
				<Progress value={progress} indicatorColor={progressColor} />
			</CardContent>
		</Card>
	)
}

export default ProgressCard
