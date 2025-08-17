import { useRouter, useSearchParams } from 'next/navigation'

const useUtilsSearchParams = () => {
	const router = useRouter()
	const searchParams = useSearchParams()

	const updateSearchParams = (key: string, value?: string) => {
		const params = new URLSearchParams(searchParams.toString())

		const stringValue = value ? String(value) : ''

		if (stringValue?.trim()) {
			params.set(key, stringValue.trim())
		} else {
			params.delete(key)
		}

		params.delete('page')
		router.push(`?${params.toString()}`)
	}

	const updateMultipleSearchParams = (
		updates: Record<string, string | undefined>
	) => {
		const params = new URLSearchParams(searchParams.toString())

		Object.entries(updates).forEach(([key, value]) => {
			const stringValue = value ? String(value) : ''

			if (stringValue?.trim()) {
				params.set(key, stringValue.trim())
			} else {
				params.delete(key)
			}
		})

		params.delete('page')
		router.push(`?${params.toString()}`)
	}

	const clearSearchParams = () => {
		router.push(window.location.pathname)
	}

	return { updateSearchParams, updateMultipleSearchParams, clearSearchParams }
}

export default useUtilsSearchParams
