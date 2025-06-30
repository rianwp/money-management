'use client'

import TransactionAction from '@/components/dashboard/Transaction/TransactionAction'
import TransactionTable from '@/components/dashboard/Transaction/TransactionTable'

const Page = () => {
	return (
		<div className="flex flex-col gap-y-8 w-full">
			<div className="grid grid-cols-4 w-full gap-8"></div>
			<div className="grid grid-cols-3 w-full gap-8">
				<div className="lg:col-span-2 col-span-3 flex flex-col gap-y-8">
					<TransactionAction />
					<TransactionTable limit={5} />
				</div>
			</div>
		</div>
	)
}

export default Page
