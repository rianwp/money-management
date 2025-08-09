import DashboardPage from '@/components/page/dashboard'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Dashboard',
	description: '',
}

const Page = () => {
	return <DashboardPage />
}

export default Page
