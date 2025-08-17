import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import DynamicIcon from '@/components/utils/DynamicIcon'
import { capitalize, cn, formatDate, formatRupiah } from '@/lib/utils'
import { IconName } from '@/types/icon'
import { TransactionType } from '@prisma/client'
import { useMemo } from 'react'
import ActionCategoryDialog from './ActionCategoryDialog'
import DeleteConfirmationAlert from '../DeleteConfirmationAlert'
import { Button } from '@/components/ui/button'
import { Edit } from 'lucide-react'
import useDeleteCategory from '@/hooks/category/useDeleteCategory'

interface ICategoryCardProps {
	icon: IconName
	type: TransactionType
	title: string
	description: string
	budget: number
	monthlyBudget: number
	target?: number | null
	monthlyTarget?: number | null
	lastActivity: Date
	transactionsCount: number
	id: number
}

const typeStyle = {
	INCOME: {
		bg: 'bg-success/80',
	},
	EXPENSE: {
		bg: 'bg-destructive/80',
	},
}

const CategoryCard = ({
	budget,
	description,
	icon,
	lastActivity,
	title,
	transactionsCount,
	type,
	monthlyBudget,
	monthlyTarget,
	target,
	id,
}: ICategoryCardProps) => {
	const { mutate: deleteCategory } = useDeleteCategory()
	const getBackgroundIcon = () => typeStyle[type].bg

	const getProgressColor = (progress: number) => {
		if (progress === 0) return { color: '#6B7280', background: '#E5E7EB' }
		if (type === TransactionType.INCOME) {
			if (progress < 50) return { color: '#EAB308', background: '#EAB30826' }
			return { color: '#22C55E', background: '#22C55E26' }
		}
		if (type === TransactionType.EXPENSE) {
			if (progress < 50) return { color: '#3B82F6', background: '#3B82F626' }
			if (progress >= 50 && progress <= 70)
				return { color: '#EAB308', background: '#EAB30826' }
			return { color: '#EF4444', background: '#EF444426' }
		}
	}

	const getPercentageText = (value: number) => {
		if (type === TransactionType.INCOME) return `${value}% achieved`
		if (type === TransactionType.EXPENSE) return `${value}% used`
	}

	const progress = useMemo(() => {
		if (target === undefined || target === null || target <= 0) return 0
		return Number(Math.min((budget / target) * 100, 100).toFixed())
	}, [budget, target])

	const progressMonthly = useMemo(() => {
		if (
			monthlyTarget === undefined ||
			monthlyTarget === null ||
			monthlyTarget <= 0
		)
			return 0
		return Number(
			Math.min((monthlyBudget / monthlyTarget) * 100, 100).toFixed()
		)
	}, [monthlyBudget, monthlyTarget])

	const handleDelete = (id: number) => {
		deleteCategory({ id })
	}

	return (
		<Card className="py-4 flex flex-col gap-1 shadow-2xs hover:shadow-lg transition-shadow duration-200">
			<CardHeader className="flex flex-row justify-between gap-3 mb-6">
				<div className="flex flex-row md:gap-3 gap-1.5 items-center">
					<div
						className={cn(
							getBackgroundIcon(),
							'p-1 rounded-lg h-10 w-10 flex items-center justify-center text-white'
						)}
					>
						<DynamicIcon name={icon} className="w-6 h-6" />
					</div>
					<div className="flex-1">
						<h3 className="font-semibold text-lg line-clamp-1 break-all">
							{title}
						</h3>
						<p className="text-gray-500 text-sm">{description}</p>
					</div>
				</div>
				<Badge variant="outline" className="text-xs">
					{capitalize(type)}
				</Badge>
			</CardHeader>
			<CardContent className="flex flex-col gap-2.5 justify-between h-full">
				<div className="flex flex-col gap-2.5">
					<div className="flex flex-col gap-1">
						<div className="flex flex-row justify-between gap-1 mb-0.5">
							<p className="text-sm font-medium">Total</p>
							<p className="text-sm text-gray-600 text-end">
								{target
									? `${formatRupiah(budget)} / ${formatRupiah(target)}`
									: formatRupiah(budget)}
							</p>
						</div>
						{target ? (
							<>
								<Progress
									value={progress}
									indicatorColor={getProgressColor(progress)?.color}
									className="h-3"
								/>
								<span
									className="text-xs px-2 py-1 rounded-full w-fit"
									style={{
										backgroundColor: getProgressColor(progress)?.background,
										color: getProgressColor(progress)?.color,
									}}
								>
									{getPercentageText(progress)}
								</span>
							</>
						) : null}
					</div>
					<div className="flex flex-col gap-1">
						<div className="flex flex-row justify-between gap-1 mb-0.5">
							<p className="text-sm font-medium">Monthly</p>
							<p className="text-sm text-gray-600 text-end">
								{monthlyTarget
									? `${formatRupiah(monthlyBudget)} / ${formatRupiah(
											monthlyTarget
									  )}`
									: formatRupiah(monthlyBudget)}
							</p>
						</div>
						{monthlyTarget ? (
							<>
								<Progress
									value={progressMonthly}
									indicatorColor={getProgressColor(progressMonthly)?.color}
									className="h-3"
								/>
								<span
									className="text-xs px-2 py-1 rounded-full w-fit"
									style={{
										backgroundColor:
											getProgressColor(progressMonthly)?.background,
										color: getProgressColor(progressMonthly)?.color,
									}}
								>
									{getPercentageText(progressMonthly)}
								</span>
							</>
						) : null}
					</div>
				</div>
				<div className="flex flex-col gap-2.5">
					<Separator />
					<div className="flex flex-row gap-10">
						<div className="w-1/2">
							<p className="text-xs text-gray-500">Transactions</p>
							<p className="font-semibold">{transactionsCount}</p>
						</div>
						<div className="w-1/2">
							<p className="text-xs text-gray-500">Last Activity</p>
							<p className="font-semibold">{formatDate(lastActivity)}</p>
						</div>
					</div>
					<Separator />
					<div className="flex flex-row justify-end gap-2">
						<ActionCategoryDialog
							defaultValues={{
								id,
								type,
								name: title,
								description,
								icon,
								target: target || undefined,
								monthlyTarget: monthlyTarget || undefined,
							}}
						>
							<Button variant="outline" size="sm">
								<Edit />
							</Button>
						</ActionCategoryDialog>
						<DeleteConfirmationAlert onDelete={() => handleDelete(id)} />
					</div>
				</div>
			</CardContent>
		</Card>
	)
}

export default CategoryCard
