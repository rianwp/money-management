import { Card, CardContent } from '@/components/ui/card'
import useGetTransaction from '@/hooks/transaction/useGetTransaction'
import { Download, Filter } from 'lucide-react'
import TransactionCard from './TransactionCard'
import { IconName } from '@/types/icon'
import SectionLoader from '@/components/utils/SectionLoader'
import ButtonLoader from '@/components/utils/ButtonLoader'

interface ITransactionTableProps {
	limit?: number
}

const TransactionTable = ({ limit }: ITransactionTableProps) => {
	const { data, isLoading, isPending } = useGetTransaction({
		limit,
	})
	return (
		<Card className="flex flex-col">
			{!isLoading ? (
				<>
					<CardContent className="flex justify-between items-center gap-x-2">
						<div className="flex flex-col">
							<h2 className="font-semibold text-2xl">Recent Transactions</h2>
							<p className="text-gray-500">Your latest financial activity</p>
						</div>
						<div className="flex flex-row gap-x-4">
							<ButtonLoader
								variant="outline"
								isLoading={isPending}
								icon={<Filter />}
							>
								Filter
							</ButtonLoader>
							<ButtonLoader
								variant="outline"
								isLoading={isPending}
								icon={<Download />}
							>
								Export
							</ButtonLoader>
						</div>
					</CardContent>
					<CardContent className="pt-0 flex flex-col gap-y-4">
						{data?.data?.map((item, index) => (
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
					</CardContent>
				</>
			) : (
				<SectionLoader />
			)}
		</Card>
	)
}

export default TransactionTable
