'use client'

import dynamic from 'next/dynamic'
import { FC, memo } from 'react'
import { LucideProps } from 'lucide-react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { IconName } from '@/types/icon'

interface IDynamicIconProps extends LucideProps {
	name: IconName
}

const icons = Object.keys(dynamicIconImports) as IconName[]

type ReactComponent = FC<{ className?: string }>
const icons_components = {} as Record<IconName, ReactComponent>

for (const name of icons) {
	const NewIcon = dynamic(dynamicIconImports[name], {
		ssr: false,
	}) as ReactComponent
	icons_components[name] = NewIcon
}

const DynamicIcon = memo(({ name, ...props }: IDynamicIconProps) => {
	const Icon = icons_components[name]

	if (!Icon) return null

	return <Icon {...props} />
})

DynamicIcon.displayName = 'DynamicIcon'

export default DynamicIcon
