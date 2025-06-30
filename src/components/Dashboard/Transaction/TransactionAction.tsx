import { Card, CardAction, CardContent } from '@/components/ui/card'
import ActionPopUp from './ActionPopUp'

const TransactionAction = () => {
	return (
		<Card>
			<CardContent className="flex flex-row justify-between items-center gap-x-2">
				<h2 className="font-semibold text-2xl">Action</h2>
				<CardAction className="flex flex-row gap-x-4">
					<ActionPopUp type="INCOME" />
					<ActionPopUp type="EXPENSE" />
				</CardAction>
			</CardContent>
		</Card>
	)
}

export default TransactionAction
