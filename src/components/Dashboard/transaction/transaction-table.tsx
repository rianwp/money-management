'use client'

import { Card, CardContent } from '@/components/ui/card'
import useGetTransaction from '@/hooks/transaction/use-get-transaction'
import { Download } from 'lucide-react'
import TransactionCard from './transaction-card'
import { IconName } from '@/types/icon'
import { Skeleton } from '@/components/ui/skeleton'
import ButtonLoader from '@/components/utils/button-loader'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import DeleteConfirmationAlert from '../delete-confirmation-alert'
import useDeleteTransaction from '@/hooks/transaction/use-delete-transaction'
import ActionTransactionDialog from './action-transaction-dialog'
import useIntersectionObserver from '@/hooks/use-intersection-observer'
import EmptyStateWrapper from '@/components/utils/empty-state-wrapper'
import { useMemo } from 'react'
import SearchInput from '@/components/utils/search-input'
import FilterDialog from '../filter-dialog'
import { IFilterField } from '@/types/form'
import useGetCategory from '@/hooks/category/use-get-gategory'
import { capitalize, parseDate } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import useFilterParams from '@/hooks/use-filter-params'
import useExportTransaction from '@/hooks/transaction/use-export-transaction'

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
	const searchParams = useSearchParams()
	const { data: categories } = useGetCategory()
	const { mutate: exportMutate } = useExportTransaction()

	const filterFields: IFilterField[] = [
		{
			name: 'date',
			label: 'Date Range',
			fieldType: 'date-range',
			placeholder: 'From date',
			placeholderEnd: 'To date',
		},
		{
			name: 'category',
			label: 'Category',
			fieldType: 'select',
			placeholder: 'Select category',
			options:
				categories?.data?.map((cat) => ({
					label: `${cat.name} (${capitalize(cat.type)})`,
					value: String(cat.id),
				})) || [],
		},
		{
			name: 'type',
			label: 'Type',
			fieldType: 'type-select',
			placeholder: 'Select type',
		},
		{
			name: 'sort',
			label: 'Sort Order',
			fieldType: 'sort-select',
			placeholder: 'Select sort order',
		},
	]

	const { filters, handleFilterSubmit } = useFilterParams(filterFields)

	const handleExport = () => {
		exportMutate(filters)
	}

	const {
		data: transactions,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useGetTransaction({
		limit: limit === 'lazy' ? null : limit,
		categoryId: filters?.category,
		startDate: parseDate(filters?.date?.from),
		endDate: parseDate(filters?.date?.to),
		search: searchParams?.get('search') || undefined,
		sort: filters?.sort,
		type: filters?.type,
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

	const transactionsFlat = useMemo(
		() => transactions?.pages.flatMap((page) => page.data || []) || [],
		[transactions?.pages]
	)

	const isEmpty = useMemo(
		() => transactionsFlat?.length === 0 && !isLoading,
		[transactions, isLoading]
	)

	const handleDelete = (id: number) => {
		deleteTransaction({ id })
	}

	return (
		<section>
			{showExtension && (
				<div className="flex flex-row flex-wrap justify-between md:gap-4 gap-2 mb-4">
					<SearchInput
						isLoading={isLoading}
						placeholder="Search Transactions..."
					/>
					<div className="flex flex-row md:gap-x-4 gap-x-2">
						<FilterDialog
							fields={filterFields}
							handleSubmit={handleFilterSubmit}
							defaultValues={filters}
							description="Filter your transactions using the options below"
						/>
						<ButtonLoader
							variant="outline"
							size="lg"
							isLoading={isLoading}
							disabled={isEmpty}
							icon={<Download />}
							onClick={handleExport}
						>
							Export
						</ButtonLoader>
					</div>
				</div>
			)}
			<Card className="flex flex-col">
				<CardContent className="flex justify-between items-center gap-x-2 md:px-6 px-4">
					<div className="flex flex-col">
						<h2 className="font-semibold text-2xl">Recent Transactions</h2>
						<p className="text-gray-500 text-sm">
							Your latest financial activity
						</p>
					</div>
				</CardContent>

				<CardContent className="pt-0 flex flex-col gap-y-4 md:px-6 px-4">
					<EmptyStateWrapper
						isEmpty={isEmpty}
						message="You have no transactions yet"
					>
						{transactionsFlat.map((item) => (
							<div
								key={item.id}
								className="flex flex-row w-full md:gap-x-4 gap-x-2 items-center"
							>
								<TransactionCard
									amount={Number(item.amount)}
									category={item.category.name}
									icon={item.category.icon as IconName}
									date={item.date}
									description={
										item.description
											? `${item.category.name} | ${item.description}`
											: item.category.name
									}
									title={item.title}
									type={item.type}
								/>

								{showExtension ? (
									<div className="flex md:flex-row flex-col gap-x-4 gap-y-2">
										<ActionTransactionDialog
											key={`edit-transaction-${JSON.stringify({
												id: item.id,
												type: item.type,
												amount: item.amount,
												description: item.description,
												categoryId: item.categoryId,
												date: item.date,
												title: item.title,
											})}`}
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
											key={`delete-transaction-${item.id}`}
											onDelete={() => handleDelete(item.id)}
										/>
									</div>
								) : null}
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
		</section>
	)
}

export default TransactionTable
