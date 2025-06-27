'use client'

import TransactionTable from '@/components/dashboard/Transaction/TransactionTable'

const Page = () => {
	return (
		<div>
			<TransactionTable limit={5} />
		</div>
	)
}

export default Page
