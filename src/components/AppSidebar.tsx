import {
	Calendar,
	Home,
	Settings,
	DollarSign,
	ChartNoAxesColumnIncreasing,
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
} from './ui/sidebar'

const items = [
	{
		title: 'Dashboard',
		url: '#',
		icon: Home,
	},
	{
		title: 'Income & Outcome',
		url: '#',
		icon: DollarSign,
	},
	{
		title: 'Scheduling',
		url: '#',
		icon: Calendar,
	},
	{
		title: 'Market & Investment',
		url: '#',
		icon: ChartNoAxesColumnIncreasing,
	},
	{
		title: 'Settings',
		url: '#',
		icon: Settings,
	},
]

const AppSidebar = () => {
	return (
		<Sidebar>
			<SidebarHeader className="font-bold">Money Management</SidebarHeader>
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
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter />
		</Sidebar>
	)
}

export default AppSidebar
