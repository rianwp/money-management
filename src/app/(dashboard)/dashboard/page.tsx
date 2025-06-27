'use client'

import TransactionTable from '@/components/dashboard/Transaction/TransactionTable'

const Page = () => {
	return (
		<div>
			<TransactionTable limit={6} />
		</div>
	)
}

export default Page
