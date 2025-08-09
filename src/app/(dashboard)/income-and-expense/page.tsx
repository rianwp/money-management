import IncomeExpensePage from '@/components/page/dashboard/income-and-expense'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Income and Expense',
	description: '',
}

const Page = () => {
	return <IncomeExpensePage />
}

export default Page
