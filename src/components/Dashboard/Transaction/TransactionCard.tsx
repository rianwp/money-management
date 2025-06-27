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
			bg: 'bg-green-500/80',
			text: 'text-green-500',
			prefix: '+',
		},
		EXPENSE: {
			bg: 'bg-red-500/80',
			text: 'text-red-500',
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
						'p-1 rounded-full h-10 w-10 flex items-center justify-center'
					)}
				>
					<DynamicIcon name={icon} className="w-6 h-6 text-white" />
				</div>
				<div className="flex flex-col">
					<h3 className="font-semibold">{title}</h3>
					<p className="text-gray-500">{description}</p>
				</div>
			</div>
			<div className="flex flex-col">
				<h4 className={cn(getColor(), 'font-bold')}>
					{typeStyle[type].prefix}
					{formatRupiah(amount)}
				</h4>
				<p className="text-gray-500">{formatDate(date)}</p>
			</div>
		</Card>
	)
}

export default TransactionCard
