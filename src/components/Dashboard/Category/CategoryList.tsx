import SearchInput from '@/components/utils/SearchInput'
import FilterDialog from '../FilterDialog'
import { useMemo } from 'react'
import useLazyGetCategory from '@/hooks/category/useLazyGetCategory'
import useIntersectionObserver from '@/hooks/useIntersectionObserver'
import { IFilterField } from '@/types/form'
import useFilterParams from '@/hooks/useFilterParams'
import { parseDate } from '@/lib/utils'
import { useSearchParams } from 'next/navigation'
import { TransactionType } from '@prisma/client'
import ButtonLoader from '@/components/utils/ButtonLoader'
import { Plus } from 'lucide-react'
import ActionCategoryDialog from './ActionCategoryDialog'
import CategoryTypeSwitch from './CategoryTypeSwitch'
import CategoryCard from './CategoryCard'
import { IconName } from '@/types/icon'

const filterFields: IFilterField[] = [
	{
		name: 'date',
		label: 'Date Range',
		fieldType: 'date-range',
		placeholder: 'From date',
		placeholderEnd: 'To date',
	},
	{
		name: 'sort',
		label: 'Sort Order',
		fieldType: 'sort-select',
		placeholder: 'Select sort order',
	},
]

const CategoryList = () => {
	const searchParams = useSearchParams()
	const { filters, handleFilterSubmit } = useFilterParams(filterFields)

	const validatedType = useMemo(() => {
		const type = searchParams?.get('type')
		return type === TransactionType.INCOME || type === TransactionType.EXPENSE
			? type
			: undefined
	}, [searchParams])

	const {
		data: categories,
		isLoading,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
	} = useLazyGetCategory({
		startDate: parseDate(filters?.date?.from),
		endDate: parseDate(filters?.date?.to),
		search: searchParams?.get('search') || undefined,
		sort: filters?.sort,
		type: validatedType,
		include:
			'transactions_count,transactions_amount,last_activity,monthly_budget',
	})

	const loadMoreRef = useIntersectionObserver<HTMLDivElement>(
		() => {
			if (hasNextPage && !isFetchingNextPage) {
				fetchNextPage()
			}
		},
		{ threshold: 0.1 }
	)

	const categoriesFlat = useMemo(
		() => categories?.pages.flatMap((page) => page.data || []) || [],
		[categories?.pages]
	)

	const isEmpty = useMemo(
		() => categoriesFlat?.length === 0 && !isLoading,
		[categories, isLoading]
	)

	return (
		<section>
			<div className="flex flex-row flex-wrap lg:flex-nowrap justify-between md:gap-4 gap-2 mb-4">
				<SearchInput isLoading={isLoading} placeholder="Search Categories..." />
				<CategoryTypeSwitch />
				<div className="flex flex-row md:gap-x-4 gap-x-2">
					<FilterDialog
						fields={filterFields}
						handleSubmit={handleFilterSubmit}
						defaultValues={filters}
						description="Filter your categories using the options below"
					/>
					<ActionCategoryDialog>
						<ButtonLoader size="lg" isLoading={isLoading} icon={<Plus />}>
							Add Category
						</ButtonLoader>
					</ActionCategoryDialog>
				</div>
			</div>
			<div className="grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 md:gap-6 gap-4">
				{categoriesFlat.map((item, index) => (
					<CategoryCard
						key={index}
						budget={item.transactionsAmount || 0}
						description={item.description || ''}
						icon={item.icon as IconName}
						lastActivity={item.lastActivity || item.updatedAt}
						title={item.name}
						transactionsCount={item?._count.transactions || 0}
						monthlyBudget={item.monthlyBudget || 0}
						monthlyTarget={item.monthlyTarget}
						target={item.target}
						type={item.type}
					/>
				))}
			</div>
		</section>
	)
}

export default CategoryList
