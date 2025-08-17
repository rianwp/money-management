import { Card, CardAction, CardContent } from '@/components/ui/card'
import ActionCategoryDialog from './action-transaction-dialog'
import { TransactionType } from '@prisma/client'

const TransactionAction = () => {
	return (
		<Card>
			<CardContent className="flex flex-row flex-wrap justify-between items-center gap-4 md:px-6 px-4">
				<h2 className="font-semibold text-2xl">Action</h2>
				<CardAction className="flex flex-row flex-wrap gap-4">
					<ActionCategoryDialog type={TransactionType.INCOME} />
					<ActionCategoryDialog type={TransactionType.EXPENSE} />
				</CardAction>
			</CardContent>
		</Card>
	)
}

export default TransactionAction
