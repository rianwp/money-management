import { formatDate, parseDate } from '@/lib/utils'
import { IFilterField } from '@/types/form'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import useUtilsSearchParams from './useUtilsSearchParams'

const useFilterParams = (fieldInput: IFilterField[]) => {
	const searchParams = useSearchParams()
	const { updateMultipleSearchParams } = useUtilsSearchParams()
	const [skipNextSync, setSkipNextSync] = useState(false)

	const mapSearchParamsToFilters = () =>
		fieldInput.reduce((acc, field) => {
			const name = field.name
			const type = field.fieldType

			if (type === 'date-range') {
				acc[name] = {
					from: parseDate(searchParams?.get(`${name}.from`) || '') || undefined,
					to: parseDate(searchParams?.get(`${name}.to`) || '') || undefined,
				}
			} else if (type === 'date') {
				acc[name] = parseDate(searchParams?.get(name) || '') || undefined
			} else {
				acc[name] = searchParams?.get(name) || undefined
			}

			return acc
		}, {} as Record<string, any>)

	const mapValuesToSearchParams = (values: Record<string, any>) =>
		fieldInput.reduce((acc, field) => {
			const name = field.name
			const type = field.fieldType
			const value = values?.[name]

			if (type === 'date-range') {
				acc[`${name}.from`] = formatDate(value?.from) || undefined
				acc[`${name}.to`] = formatDate(value?.to) || undefined
			} else if (type === 'date') {
				acc[name] = formatDate(value) || undefined
			} else {
				acc[name] = value
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
