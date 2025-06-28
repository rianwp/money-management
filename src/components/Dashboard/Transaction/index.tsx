import Action from './Action'
import TransactionTable from './TransactionTable'

interface ITransactionProps {
	limit?: number
}

const Transaction = ({ limit }: ITransactionProps) => {
	return (
		<section className="flex flex-col gap-y-8">
			<Action />
			<TransactionTable limit={limit} />
		</section>
	)
}

export default Transaction
