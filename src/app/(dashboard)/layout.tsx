import AppSidebar from '@/components/AppSidebar'
import Header from '@/components/Header'
import { SidebarProvider } from '@/components/ui/sidebar'

interface ILayoutProps {
	children: React.ReactNode
}

const Layout = async ({ children }: ILayoutProps) => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="w-full">
				<Header />
				<div className="p-4">{children}</div>
			</main>
		</SidebarProvider>
	)
}

export default Layout
