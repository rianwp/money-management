import { Card, CardContent } from '@/components/ui/card'
import useGetTransaction from '@/hooks/transaction/useGetTransaction'
import { Download, Filter } from 'lucide-react'
import TransactionCard from './TransactionCard'
import { IconName } from '@/types/icon'
import { Skeleton } from '@/components/ui/skeleton'
import ButtonLoader from '@/components/utils/ButtonLoader'
import { buttonVariants } from '@/components/ui/button'
import Link from 'next/link'
import { Prisma } from '@prisma/client'
import useLazyLoad from '@/hooks/useLazyLoad'
import DeleteConfirmationAlert from '../DeleteConfirmationAlert'
import useDeleteTransaction from '@/hooks/transaction/useDeleteTransaction'
import ActionTransactionDialog from './ActionTransactionDialog'

interface ITransactionTableProps {
	limit: number | 'lazy'
	showExtension?: boolean
	showMore?: boolean
}

const PAGE_SIZE = 10

const TransactionTable = ({
	limit,
	showExtension = false,
	showMore = false,
}: ITransactionTableProps) => {
	const {
		data: transactions,
		isLoading,
		observerRef,
		staticMode,
	} = useLazyLoad<
		Prisma.TransactionGetPayload<{ include: { category: true } }>
	>({
		useQueryHook: useGetTransaction,
		limit: limit === 'lazy' ? undefined : limit,
		pageSize: PAGE_SIZE,
	})

	const { mutate: deleteTransaction } = useDeleteTransaction()

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
				{showExtension ? (
					<div className="flex flex-row gap-x-4">
						<ButtonLoader
							variant="outline"
							isLoading={isLoading}
							icon={<Filter />}
						>
							Filter
						</ButtonLoader>
						<ButtonLoader
							variant="outline"
							isLoading={isLoading}
							icon={<Download />}
						>
							Export
						</ButtonLoader>
					</div>
				) : null}
			</CardContent>

			<CardContent className="pt-0 flex flex-col gap-y-4">
				{transactions.map((item, index) => (
					<div
						key={index}
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

						{showExtension ? (
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
						) : null}
						{showExtension ? (
							<DeleteConfirmationAlert onDelete={() => handleDelete(item.id)} />
						) : null}
					</div>
				))}
				{!staticMode ? <div ref={observerRef} className="-mt-4" /> : null}
				{isLoading
					? Array.from({ length: 5 }).map((_, i) => (
							<Skeleton key={i} className="h-16 w-full rounded-md" />
					  ))
					: null}
				{showMore ? (
					<Link
						href="/income-and-expense"
						className={buttonVariants({
							variant: 'outline',
						})}
					>
						Show More
					</Link>
				) : null}
			</CardContent>
		</Card>
	)
}

export default TransactionTable
