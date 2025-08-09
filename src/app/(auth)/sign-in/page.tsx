import SignInPage from '@/components/page/auth/sign-in'
import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Sign In',
	description: '',
}

const Page = () => {
	return <SignInPage />
}

export default Page
