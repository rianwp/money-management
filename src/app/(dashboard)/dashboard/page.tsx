'use client'

import TransactionAction from '@/components/dashboard/Transaction/TransactionAction'
import TransactionTable from '@/components/dashboard/Transaction/TransactionTable'
import BalanceCard from '@/components/dashboard/UserSummary/BalanceCard'
import ProgressCard from '@/components/dashboard/UserSummary/ProgressCard'
import useGetUserGrowth from '@/hooks/user/useGetUserGrowth'

const Page = () => {
	const { data: growth, isLoading: isGrowthLoading } = useGetUserGrowth()
	return (
		<div className="flex flex-col gap-y-8 w-full">
			<div className="grid xl:grid-cols-5 grid-cols-4 lg:grid-rows-2 w-full gap-8">
				<div className="xl:col-span-2 lg:col-span-2 col-span-4 xl:row-span-2 lg:row-span-1">
					<BalanceCard />
				</div>
				<div className="xl:col-span-1 lg:col-span-2 col-span-4 xl:row-span-2 lg:row-span-1">
					<ProgressCard
						title="Balance Growth This Month"
						value={growth?.data?.balanceGrowth?.label || ''}
						progress={growth?.data?.balanceGrowth?.progress || 0}
						description="vs last Month"
						progressColor="var(--color-green-600)"
						textColor="var(--color-green-600)"
						isLoading={isGrowthLoading}
					/>
				</div>
				<div className="xl:col-span-1 lg:col-span-2 col-span-4 xl:row-span-2 lg:row-span-1 lg:row-start-2">
					<ProgressCard
						title="Income Growth This Month"
						value={growth?.data?.incomeGrowth?.label || ''}
						progress={growth?.data?.incomeGrowth?.progress || 0}
						description="vs last Month"
						progressColor="var(--color-blue-600)"
						textColor="var(--color-blue-600)"
						isLoading={isGrowthLoading}
					/>
				</div>
				<div className="xl:col-span-1 lg:col-span-2 col-span-4 xl:row-span-2 lg:row-span-1 lg:row-start-2">
					<ProgressCard
						title="Expense Growth This Month"
						value={growth?.data?.expenseGrowth?.label || ''}
						progress={growth?.data?.expenseGrowth?.progress || 0}
						description="vs last Month"
						progressColor="var(--color-destructive)"
						textColor="var(--color-destructive)"
						isLoading={isGrowthLoading}
					/>
				</div>
			</div>
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
