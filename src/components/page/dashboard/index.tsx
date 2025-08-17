'use client'

import TransactionTable from '@/components/dashboard/transaction/transaction-table'
import BalanceCard from '@/components/dashboard/user-summary/BalanceCard'
import useGetUserGrowth from '@/hooks/user/use-get-user-growth'
import {
	ProgressCard,
	ProgressCardDescription,
	ProgressCardTitle,
	ProgressCardValue,
} from '@/components/dashboard/user-summary/ProgressCard'
import useGetUserBalance from '@/hooks/user/use-get-user-balance'
import useGetCategory from '@/hooks/category/use-get-gategory'
import CategoryCard from '@/components/dashboard/category/category-card'
import { IconName } from '@/types/icon'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import EmptyStateWrapper from '@/components/utils/empty-state-wrapper'
import { useMemo } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const DashboardPage = () => {
	const { data: growth, isLoading: isGrowthLoading } = useGetUserGrowth()
	const { data: balance, isLoading: isBalanceLoading } = useGetUserBalance()
	const { data: categories, isLoading: isCategoriesLoading } = useGetCategory({
		limit: 2,
		include:
			'transactions_count,transactions_amount,last_activity,monthly_budget',
	})

	const isEmpty = useMemo(
		() => categories?.data?.length === 0 && !isCategoriesLoading,
		[categories, isCategoriesLoading]
	)

	return (
		<div className="flex flex-col gap-y-8 w-full">
			<div className="grid xl:grid-cols-5 grid-cols-4 lg:grid-rows-2 w-full gap-8">
				<div className="xl:col-span-2 lg:col-span-2 col-span-4 xl:row-span-2 lg:row-span-1">
					<BalanceCard isLoading={isBalanceLoading} data={balance} />
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
					<TransactionTable limit={5} showMore />
				</div>
				<div className="lg:col-span-1 col-span-3 flex flex-col gap-y-8">
					<EmptyStateWrapper
						isEmpty={isEmpty}
						message="You have no category yet"
					>
						{isCategoriesLoading
							? Array.from({ length: 2 }).map((_, i) => (
									<Skeleton key={i} className="h-[200px] w-full rounded-md" />
							  ))
							: categories?.data?.map((item, index) => (
									<CategoryCard
										key={index}
										id={item.id}
										budget={item.transactionsAmount || 0}
										description={item.description || ''}
										icon={item.icon as IconName}
										lastActivity={item.lastActivity || item.updatedAt}
										title={item.name}
										transactionsCount={item?._count.transactions || 0}
										monthlyBudget={item.monthlyBudget || 0}
										monthlyTarget={item.monthlyTarget}
										target={item.target}
										type={item.type}
										showExtension={false}
									/>
							  ))}
					</EmptyStateWrapper>
					<Link
						href="/category"
						className={buttonVariants({ variant: 'outline' })}
					>
						Show More
					</Link>
				</div>
			</div>
		</div>
	)
}

export default DashboardPage
