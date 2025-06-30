import { Card } from '@/components/ui/card'
import DynamicIcon from '@/components/utils/DynamicIcon'
import { cn, formatDate, formatRupiah } from '@/lib/utils'
import { IconName } from '@/types/icon'
import { TransactionType } from '@prisma/client'

interface ITransactionCardProps {
	icon: IconName
	type: TransactionType
	title: string
	description: string
	amount: number
	date: Date
	category: string
}

const TransactionCard = ({
	icon,
	type,
	title,
	description,
	amount,
	date,
}: ITransactionCardProps) => {
	const typeStyle = {
		INCOME: {
			bg: 'bg-success/20',
			text: 'text-success',
			prefix: '+',
		},
		EXPENSE: {
			bg: 'bg-destructive/20',
			text: 'text-destructive',
			prefix: '-',
		},
	}
	const getBackgroundIcon = () => typeStyle[type].bg

	const getColor = () => typeStyle[type].text

	return (
		<Card className="p-4 flex flex-row justify-between items-center gap-x-2">
			<div className="flex flex-row gap-x-4">
				<div
					className={cn(
						getBackgroundIcon(),
						getColor(),
						'p-1 rounded-full h-10 w-10 flex items-center justify-center'
					)}
				>
					<DynamicIcon name={icon} className="w-6 h-6" />
				</div>
				<div className="flex flex-col">
					<h3 className="font-semibold">{title}</h3>
					<p className="text-gray-500 text-sm">{description}</p>
				</div>
			</div>
			<div className="flex flex-col ">
				<h4 className={cn(getColor(), 'font-bold text-lg')}>
					{typeStyle[type].prefix}
					{formatRupiah(amount)}
				</h4>
				<p className="text-gray-500 text-sm">{formatDate(date)}</p>
			</div>
		</Card>
	)
}

export default TransactionCard
