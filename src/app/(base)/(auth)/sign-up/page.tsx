import SignUpPage from '@/components/page/auth/sign-up'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Sign Up',
	description: '',
}

const Page = () => {
	return <SignUpPage />
}

export default Page
