import { Search } from 'lucide-react'
import { Input } from '../ui/input'
import ButtonLoader from './button-loader'
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import useUtilsSearchParams from '@/hooks/use-utils-search-params'

interface ISearchInputProps {
	isLoading: boolean
	paramName?: string
	placeholder?: string
	debounceMs?: number
	autoSearch?: boolean
}

const SearchInput = ({
	isLoading,
	paramName = 'search',
	placeholder = 'Search',
	debounceMs = 500,
	autoSearch = false,
}: ISearchInputProps) => {
	const searchParams = useSearchParams()
	const [searchValue, setSearchValue] = useState(
		searchParams.get(paramName) || ''
	)

	const { updateSearchParams } = useUtilsSearchParams()

	const debouncedSearch = useDebouncedCallback((value: string) => {
		if (autoSearch) {
			updateSearchParams(paramName, value)
		}
	}, debounceMs)

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setSearchValue(value)

		if (value === '' && searchParams.get(paramName)) {
			updateSearchParams(paramName, '')
		} else if (autoSearch) {
			debouncedSearch(value)
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault()
			updateSearchParams(paramName, searchValue)
		}
	}

	const handleSearchClick = () => {
		updateSearchParams(paramName, searchValue)
	}

	useEffect(() => {
		const urlSearchValue = searchParams.get(paramName) || ''
		if (urlSearchValue !== searchValue) {
			setSearchValue(urlSearchValue)
		}
	}, [searchParams, paramName])

	return (
		<div className="relative min-w-[150px] max-w-[400px] flex-1">
			<Input
				placeholder={placeholder}
				type="text"
				value={searchValue}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
				className="bg-card h-[40px] pr-12"
			/>
			<ButtonLoader
				variant="ghost"
				size="sm"
				isLoading={isLoading}
				disabled={isLoading}
				icon={<Search />}
				onClick={handleSearchClick}
				className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 !px-2"
			/>
		</div>
	)
}

export default SearchInput
