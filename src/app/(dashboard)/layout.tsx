import AppSidebar from '@/components/dashboard/AppSidebar'
import Header from '@/components/dashboard/Header'
import { SidebarProvider } from '@/components/ui/sidebar'

interface ILayoutProps {
	children: React.ReactNode
}

const Layout = async ({ children }: ILayoutProps) => {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="w-full bg-sidebar">
				<Header />
				<div className="p-4 min-h-full-navbar">{children}</div>
			</main>
		</SidebarProvider>
	)
}

export default Layout
