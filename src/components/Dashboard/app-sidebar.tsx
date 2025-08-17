'use client'

import {
	// Calendar,
	Home,
	// Settings,
	DollarSign,
	// ChartNoAxesColumnIncreasing,
	LogOut,
	List,
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
import Logo from '../logo'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

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
		title: 'Category',
		url: '/category',
		icon: List,
	},
	// {
	// 	title: 'Scheduling',
	// 	url: '/scheduling',
	// 	icon: Calendar,
	// },
	// {
	// 	title: 'Market & Investment',
	// 	url: '/market-and-investment',
	// 	icon: ChartNoAxesColumnIncreasing,
	// },
	// {
	// 	title: 'Settings',
	// 	url: '/settings',
	// 	icon: Settings,
	// },
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
										<Link href={item.url}>
											<item.icon />
											<span>{item.title}</span>
										</Link>
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
