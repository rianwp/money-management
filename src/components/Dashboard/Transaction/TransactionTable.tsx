import { Card, CardContent } from '@/components/ui/card'
import useGetTransaction from '@/hooks/transaction/useGetTransaction'
import { Download, Filter } from 'lucide-react'
import TransactionCard from './TransactionCard'
import { IconName } from '@/types/icon'
import { Skeleton } from '@/components/ui/skeleton'
import ButtonLoader from '@/components/utils/ButtonLoader'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import DeleteConfirmationAlert from '../DeleteConfirmationAlert'
import useDeleteTransaction from '@/hooks/transaction/useDeleteTransaction'
import ActionTransactionDialog from './ActionTransactionDialog'
import useIntersectionObserver from '@/hooks/useIntersectionObserver'
import EmptyStateWrapper from '@/components/utils/EmptyStateWrapper'
import { useMemo } from 'react'

interface ITransactionTableProps {
	limit: number | 'lazy'
	showExtension?: boolean
	showMore?: boolean
}

const TransactionTable = ({
	limit,
	showExtension = false,
	showMore = false,
}: ITransactionTableProps) => {
	const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
		useGetTransaction({
			limit: limit === 'lazy' ? null : limit,
		})

	const loadMoreRef = useIntersectionObserver<HTMLDivElement>(
		() => {
			if (hasNextPage && !isFetchingNextPage) {
				fetchNextPage()
			}
		},
		{ threshold: 0.1 }
	)

	const { mutate: deleteTransaction } = useDeleteTransaction()

	const transactions = useMemo(
		() => data?.pages.flatMap((page) => page.data || []) || [],
		[data?.pages]
	)

	const isEmpty = useMemo(
		() => transactions?.length === 0 && !isLoading,
		[transactions, isLoading]
	)

	const handleDelete = (id: number) => {
		deleteTransaction({ id })
	}

	return (
		<Card className="flex flex-col">
			<CardContent className="flex justify-between items-center gap-x-2">
				<div className="flex flex-col">
					<h2 className="font-semibold text-2xl">Recent Transactions</h2>
					<p className="text-gray-500 text-sm">
						Your latest financial activity
					</p>
				</div>
				{showExtension && (
					<div className="flex flex-row gap-x-4">
						<ButtonLoader
							variant="outline"
							isLoading={isLoading}
							disabled={isEmpty}
							icon={<Filter />}
						>
							Filter
						</ButtonLoader>
						<ButtonLoader
							variant="outline"
							isLoading={isLoading}
							disabled={isEmpty}
							icon={<Download />}
						>
							Export
						</ButtonLoader>
					</div>
				)}
			</CardContent>

			<CardContent className="pt-0 flex flex-col gap-y-4">
				<EmptyStateWrapper
					isEmpty={isEmpty}
					message="You have no transactions yet"
				>
					{transactions.map((item) => (
						<div
							key={item.id}
							className="flex flex-row w-full gap-x-4 items-center"
						>
							<TransactionCard
								amount={Number(item.amount)}
								category={item.category.name}
								icon={item.category.icon as IconName}
								date={item.date}
								description={item.description || ''}
								title={item.title}
								type={item.type}
							/>

							{showExtension && (
								<>
									<ActionTransactionDialog
										defaultValues={{
											amount: Number(item.amount),
											id: item.id,
											date: new Date(item.date),
											categoryId: item.categoryId,
											description: item.description || '',
											title: item.title,
										}}
										type={item.type}
									/>
									<DeleteConfirmationAlert
										onDelete={() => handleDelete(item.id)}
									/>
								</>
							)}
						</div>
					))}
					{hasNextPage && <div ref={loadMoreRef} className="-mt-4" />}

					{(isLoading || isFetchingNextPage) &&
						Array.from({ length: 5 }).map((_, i) => (
							<Skeleton key={i} className="h-16 w-full rounded-md" />
						))}
				</EmptyStateWrapper>

				{showMore && !isEmpty ? (
					<Link
						href="/income-and-expense"
						className={buttonVariants({ variant: 'outline' })}
					>
						Show More
					</Link>
				) : null}
			</CardContent>
		</Card>
	)
}

export default TransactionTable
