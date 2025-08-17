import AppSidebar from '@/components/dashboard/app-sidebar'
import Header from '@/components/dashboard/header'
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
				<div className="md:p-8 sm:p-4 p-2 min-h-full-navbar">{children}</div>
			</main>
		</SidebarProvider>
	)
}

export default Layout
