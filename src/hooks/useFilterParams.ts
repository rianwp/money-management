import { formatDate, parseDate } from '@/lib/utils'
import { IFilterField } from '@/types/form'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import useUtilsSearchParams from './useUtilsSearchParams'
import { TransactionType } from '@prisma/client'

const useFilterParams = (fieldInput: IFilterField[]) => {
	const searchParams = useSearchParams()
	const { updateMultipleSearchParams } = useUtilsSearchParams()
	const [skipNextSync, setSkipNextSync] = useState(false)

	const validateFieldValue = (type: string, value: any) => {
		switch (type) {
			case 'date-range':
				return {
					from: parseDate(value?.from || '') || undefined,
					to: parseDate(value?.to || '') || undefined,
				}
			case 'date':
				return parseDate(value || '') || undefined
			case 'type':
				return value === TransactionType.INCOME ||
					value === TransactionType.EXPENSE
					? value
					: undefined
			case 'sort-select':
				return value === 'asc' || value === 'desc' ? value : undefined
			default:
				return value || undefined
		}
	}

	const mapSearchParamsToFilters = () =>
		fieldInput.reduce((acc, field) => {
			const name = field.name
			const type = field.fieldType

			if (type === 'date-range') {
				const rangeValue = {
					from: searchParams?.get(`${name}.from`) || '',
					to: searchParams?.get(`${name}.to`) || '',
				}
				acc[name] = validateFieldValue(type, rangeValue)
			} else {
				acc[name] = validateFieldValue(type, searchParams?.get(name))
			}

			return acc
		}, {} as Record<string, any>)

	const formatFieldValue = (type: string, value: any) => {
		switch (type) {
			case 'date-range':
				return {
					from: formatDate(value?.from) || undefined,
					to: formatDate(value?.to) || undefined,
				}
			case 'date':
				return formatDate(value) || undefined
			default:
				return value
		}
	}

	const mapValuesToSearchParams = (values: Record<string, any>) =>
		fieldInput.reduce((acc, field) => {
			const name = field.name
			const type = field.fieldType
			const value = values?.[name]

			if (type === 'date-range') {
				const formattedValue = formatFieldValue(type, value)
				acc[`${name}.from`] = formattedValue.from
				acc[`${name}.to`] = formattedValue.to
			} else {
				acc[name] = formatFieldValue(type, value)
			}

			return acc
		}, {} as Record<string, any>)

	const [filters, setFilters] = useState<Record<string, any>>(
		mapSearchParamsToFilters()
	)

	const handleFilterSubmit = (values: Record<string, any>) => {
		setFilters(values)
		setSkipNextSync(true)
		const updatedParams = mapValuesToSearchParams(values)
		updateMultipleSearchParams(updatedParams)
	}

	useEffect(() => {
		if (skipNextSync) {
			setSkipNextSync(false)
			return
		}
		setFilters(mapSearchParamsToFilters())
	}, [searchParams])

	return { handleFilterSubmit, filters }
}

export default useFilterParams
