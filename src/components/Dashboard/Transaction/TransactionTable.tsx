import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import useGetTransaction from '@/hooks/transaction/useGetTransaction'
import { Download, Filter } from 'lucide-react'
import TransactionCard from './TransactionCard'
import { IconName } from '@/types/icon'
import SectionLoader from '@/components/utils/SectionLoader'

interface ITransactionTableProps {
	limit?: number
}

const TransactionTable = ({ limit }: ITransactionTableProps) => {
	const { data, isLoading } = useGetTransaction({
		limit,
	})
	return (
		<Card className="flex flex-col">
			{!isLoading ? (
				<>
					<div className="px-6 flex justify-between items-center gap-x-2">
						<div className="flex flex-col">
							<h2 className="font-semibold text-2xl">Recent Transactions</h2>
							<p className="text-gray-500">Your latest financial activity</p>
						</div>
						<div className="flex flex-row gap-x-4">
							<Button className="btn--flex" variant="outline">
								<Filter />
								<p>Filter</p>
							</Button>
							<Button className="btn--flex" variant="outline">
								<Download />
								<p>Export</p>
							</Button>
						</div>
					</div>
					<div className="px-6 pt-0 flex flex-col gap-y-4">
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
					</div>
				</>
			) : (
				<SectionLoader />
			)}
		</Card>
	)
}

export default TransactionTable
