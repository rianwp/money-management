'use client'

import TransactionAction from '@/components/dashboard/Transaction/TransactionAction'
import TransactionTable from '@/components/dashboard/Transaction/TransactionTable'

const Page = () => {
	return (
		<div className="flex flex-col gap-y-8 w-full">
			<TransactionAction />
			<TransactionTable limit="lazy" showExtension />
		</div>
	)
}

export default Page
