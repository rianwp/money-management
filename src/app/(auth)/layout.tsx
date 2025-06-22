import { auth } from '@/lib/auth'
import { Session } from 'next-auth'
import { redirect } from 'next/navigation'

interface ILayoutProps {
	children: React.ReactNode
}

const Layout = async ({ children }: ILayoutProps) => {
	const session = (await auth()) as Session
	if (session) {
		redirect('/dashboard')
	}
	return <>{children}</>
}

export default Layout
