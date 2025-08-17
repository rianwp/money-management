'use client'

import TransactionAction from '@/components/dashboard/transaction/transaction-action'
import TransactionTable from '@/components/dashboard/transaction/transaction-table'

const IncomeExpensePage = () => {
	return (
		<div className="flex flex-col gap-y-8 w-full">
			<TransactionAction />
			<TransactionTable limit="lazy" showExtension />
		</div>
	)
}

export default IncomeExpensePage
