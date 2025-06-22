import AppSidebar from '@/components/Dashboard/AppSidebar'
import Header from '@/components/Dashboard/Header'
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
