/* eslint-disable @typescript-eslint/no-unused-vars */
import { LucideIcon } from 'lucide-react'
import { IconName } from '@/types/icon'

interface IDynamicIconProps {
	name: IconName
	size?: number
	className?: string
}

const DynamicIcon = async ({
	name,
	size = 24,
	className,
}: IDynamicIconProps) => {
	try {
		const iconModule = await import('lucide-react')
		const IconComponent = iconModule[
			name as keyof typeof iconModule
		] as LucideIcon

		if (!IconComponent) {
			console.warn(`Icon ${name} not found`)
			return null
		}

		return <IconComponent size={size} className={className} />
	} catch (error) {
		return null
	}
}

export default DynamicIcon
