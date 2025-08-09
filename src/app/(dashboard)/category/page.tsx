import CategoryPage from '@/components/page/dashboard/category'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Category',
	description: '',
}

const Page = () => {
	return <CategoryPage />
}

export default Page
