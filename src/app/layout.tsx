import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { cn } from '@/lib/utils'
import Providers from '@/components/providers'
import CustomToaster from '@/components/utils/custom-toaster'
import NextTopLoader from 'nextjs-toploader'
import '@/assets/style/globals.css'

interface IRootLayoutProps {
	children: React.ReactNode
}

const globalFont = Roboto({
	variable: '--font-roboto',
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Money Tracker',
	description: '',
}

const RootLayout = ({ children }: IRootLayoutProps) => {
	return (
		<html lang="en">
			<body className={cn(globalFont.className, 'antialiased')}>
				<NextTopLoader color="linear-gradient(to right, rgb(134, 239, 172), rgb(59, 130, 246), rgb(147, 51, 234))" />
				<Providers>{children}</Providers>
				<CustomToaster />
			</body>
		</html>
	)
}

export default RootLayout
