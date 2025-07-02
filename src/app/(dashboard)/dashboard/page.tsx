'use client'

import TransactionAction from '@/components/dashboard/Transaction/TransactionAction'
import TransactionTable from '@/components/dashboard/Transaction/TransactionTable'
import BalanceCard from '@/components/dashboard/UserSummary/BalanceCard'
import useGetUserGrowth from '@/hooks/user/useGetUserGrowth'
import {
	ProgressCard,
	ProgressCardDescription,
	ProgressCardTitle,
	ProgressCardValue,
} from '@/components/dashboard/UserSummary/ProgressCard'

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
						progress={growth?.data?.balanceGrowth?.progress || 0}
						progressColor="var(--color-green-600)"
						isLoading={isGrowthLoading}
					>
						<ProgressCardTitle>Balance Growth This Month</ProgressCardTitle>
						<ProgressCardValue color="var(--color-green-600)">
							{growth?.data?.balanceGrowth?.label || ''}
						</ProgressCardValue>
						<ProgressCardDescription>vs last Month</ProgressCardDescription>
					</ProgressCard>
				</div>
				<div className="xl:col-span-1 lg:col-span-2 col-span-4 xl:row-span-2 lg:row-span-1 lg:row-start-2">
					<ProgressCard
						progress={growth?.data?.incomeGrowth?.progress || 0}
						progressColor="var(--color-blue-600)"
						isLoading={isGrowthLoading}
					>
						<ProgressCardTitle>Income Growth This Month</ProgressCardTitle>
						<ProgressCardValue color="var(--color-blue-600)">
							{growth?.data?.incomeGrowth?.label || ''}
						</ProgressCardValue>
						<ProgressCardDescription>vs last Month</ProgressCardDescription>
					</ProgressCard>
				</div>
				<div className="xl:col-span-1 lg:col-span-2 col-span-4 xl:row-span-2 lg:row-span-1 lg:row-start-2">
					<ProgressCard
						progress={growth?.data?.expenseGrowth?.progress || 0}
						progressColor="var(--color-destructive)"
						isLoading={isGrowthLoading}
					>
						<ProgressCardTitle>Expense Growth This Month</ProgressCardTitle>
						<ProgressCardValue color="var(--color-destructive)">
							{growth?.data?.expenseGrowth?.label || ''}
						</ProgressCardValue>
						<ProgressCardDescription>vs last Month</ProgressCardDescription>
					</ProgressCard>
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
