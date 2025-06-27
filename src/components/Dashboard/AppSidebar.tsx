'use client'

import {
	Calendar,
	Home,
	Settings,
	DollarSign,
	ChartNoAxesColumnIncreasing,
	LogOut,
} from 'lucide-react'
import {
	Sidebar,
	SidebarGroup,
	SidebarContent,
	SidebarHeader,
	SidebarFooter,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from '../ui/sidebar'
import Logo from '../Logo'
import { signOut } from 'next-auth/react'

const items = [
	{
		title: 'Dashboard',
		url: '/dashboard',
		icon: Home,
	},
	{
		title: 'Income & Expense',
		url: '/income-and-expense',
		icon: DollarSign,
	},
	{
		title: 'Scheduling',
		url: '/scheduling',
		icon: Calendar,
	},
	{
		title: 'Market & Investment',
		url: '/market-and-investment',
		icon: ChartNoAxesColumnIncreasing,
	},
	{
		title: 'Settings',
		url: '/settings',
		icon: Settings,
	},
]

const AppSidebar = () => {
	return (
		<Sidebar>
			<SidebarHeader className="flex flex-row justify-start items-center h-16">
				<Logo size="sm" />
				<h1 className="font-bold text-lg">Money Tracker</h1>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{items.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<button onClick={() => signOut()}>
										<LogOut />
										<span>Logout</span>
									</button>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter />
		</Sidebar>
	)
}

export default AppSidebar
