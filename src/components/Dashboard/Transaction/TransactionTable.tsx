import { useEffect, useRef, useState, useCallback } from 'react'
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
	const [page, setPage] = useState(1)
	const [transactions, setTransactions] = useState<
		Prisma.TransactionGetPayload<{ include: { category: true } }>[]
	>([])
	const [hasMore, setHasMore] = useState(true)

	const observerRef = useRef<HTMLDivElement | null>(null)
	const staticMode = typeof limit === 'number'

	const queryParams = staticMode ? { limit } : { page, limit: PAGE_SIZE }

	const { data, isLoading } = useGetTransaction(queryParams)

	useEffect(() => {
		const newData = data?.data ?? []

		if (staticMode) {
			setTransactions(newData)
		} else {
			if (page === 1) {
				setTransactions(newData)
			} else {
				setTransactions((prev) => [...prev, ...newData])
			}

			if (newData.length < PAGE_SIZE) {
				setHasMore(false)
			} else {
				setHasMore(true)
			}
		}
	}, [data, staticMode, page])

	const handleObserver = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const target = entries[0]
			if (target.isIntersecting && hasMore && !isLoading && !staticMode) {
				setPage((prev) => prev + 1)
			}
		},
		[hasMore, isLoading, staticMode]
	)

	useEffect(() => {
		if (!staticMode) {
			const option = {
				root: null,
				rootMargin: '0px',
				threshold: 1.0,
			}

			const observer = new IntersectionObserver(handleObserver, option)
			if (observerRef.current) observer.observe(observerRef.current)

			return () => {
				if (observerRef.current) observer.unobserve(observerRef.current)
			}
		}
	}, [handleObserver, staticMode])

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
					<TransactionCard
						key={index}
						amount={Number(item.amount)}
						category={item.category.name}
						icon={item.category.icon as IconName}
						date={item.date}
						description={item.description || ''}
						title={item.title}
						type={item.type}
					/>
				))}
				{!staticMode && <div ref={observerRef} />}
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
