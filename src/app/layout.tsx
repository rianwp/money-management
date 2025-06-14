import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { cn } from '@/lib/utils'
import '@/assets/style/globals.css'
import Providers from '@/components/Providers'

interface IRootLayoutProps {
	children: React.ReactNode
}

const globalFont = Roboto({
	variable: '--font-roboto',
	weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Money Management',
	description: '',
}

const RootLayout = ({ children }: IRootLayoutProps) => {
	return (
		<html lang="en">
			<body className={cn(globalFont.className, 'antialiased')}>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}

export default RootLayout
