'use client'

import { useIsMobile } from '@/hooks/useMobile'
import { Separator } from '../../ui/separator'
import { SidebarTrigger } from '../../ui/sidebar'

const Header = () => {
	const isMobile = useIsMobile()
	return (
		<nav className="h-16 flex flex-col bg-sidebar">
			<div className="w-full h-full">
				{isMobile ? <SidebarTrigger className="size-16 " /> : null}
			</div>
			<Separator />
		</nav>
	)
}

export default Header
