import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useUtilsSearchParams from '@/hooks/use-utils-search-params'
import { capitalize } from '@/lib/utils'
import { TransactionType } from '@prisma/client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

const CategoryTypeSwitch = () => {
	const searchParams = useSearchParams()
	const { updateSearchParams } = useUtilsSearchParams()
	const [activeTab, setActiveTab] = useState('all')

	const handleTabChange = (value: string) => {
		setActiveTab(value)
		if (value === 'all') {
			updateSearchParams('type', undefined)
		} else {
			updateSearchParams('type', value)
		}
	}

	useEffect(() => {
		const type = searchParams.get('type')
		setActiveTab(type || 'all')
	}, [searchParams])

	return (
		<Tabs
			value={activeTab}
			onValueChange={handleTabChange}
			className="h-[40px] lg:order-none order-last w-full lg:w-auto"
		>
			<TabsList className="h-full lg:w-auto w-full flex-nowrap">
				<TabsTrigger value="all">All Categories</TabsTrigger>
				{Object.values(TransactionType).map((type) => (
					<TabsTrigger key={type} value={type}>
						{capitalize(type)}
					</TabsTrigger>
				))}
			</TabsList>
		</Tabs>
	)
}

export default CategoryTypeSwitch
