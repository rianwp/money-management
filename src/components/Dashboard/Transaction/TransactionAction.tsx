import { Card, CardAction, CardContent } from '@/components/ui/card'
import ActionCategoryDialog from './ActionTransactionDialog'

const TransactionAction = () => {
	return (
		<Card>
			<CardContent className="flex flex-row justify-between items-center gap-x-2">
				<h2 className="font-semibold text-2xl">Action</h2>
				<CardAction className="flex flex-row gap-x-4">
					<ActionCategoryDialog type="INCOME" />
					<ActionCategoryDialog type="EXPENSE" />
				</CardAction>
			</CardContent>
		</Card>
	)
}

export default TransactionAction
