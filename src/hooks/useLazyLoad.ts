import { useState, useRef, useCallback, useEffect } from 'react'

interface UseLazyLoadOptions<TQuery, TData> {
	useQueryHook: (query: TQuery) => {
		data?: { data?: TData[] }
		isLoading: boolean
	}
	limit?: number
	pageSize?: number
	initialQuery?: Partial<TQuery>
}

export function useLazyLoad<TData, TQuery = any>({
	useQueryHook,
	limit,
	pageSize = 10,
	initialQuery = {},
}: UseLazyLoadOptions<TQuery, TData>) {
	const [page, setPage] = useState(1)
	const [items, setItems] = useState<TData[]>([])
	const [hasMore, setHasMore] = useState(true)
	const observerRef = useRef<HTMLDivElement | null>(null)

	const staticMode = typeof limit === 'number'

	const queryParams = staticMode
		? ({ ...initialQuery, limit } as TQuery)
		: ({ ...initialQuery, page, limit: pageSize } as TQuery)

	const { data, isLoading } = useQueryHook(queryParams)

	useEffect(() => {
		const newData = data?.data ?? []
		if (staticMode) {
			setItems(newData)
		} else {
			if (page === 1) {
				setItems(newData)
			} else {
				setItems((prev) => [...prev, ...newData])
			}
			if (newData.length < (pageSize || 10)) {
				setHasMore(false)
			} else {
				setHasMore(true)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, staticMode, page])

	const handleObserver = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const target = entries[0]
			if (target.isIntersecting && hasMore && !isLoading && !staticMode) {
				setPage((prev) => prev + 1)
			}
		},
		[hasMore, isLoading, staticMode]
	)

	useEffect(() => {
		if (!staticMode) {
			const option = {
				root: null,
				rootMargin: '0px',
				threshold: 1.0,
			}
			const observer = new IntersectionObserver(handleObserver, option)
			if (observerRef.current) observer.observe(observerRef.current)
			return () => {
				if (observerRef.current) observer.unobserve(observerRef.current)
			}
		}
	}, [handleObserver, staticMode])

	return {
		data: items,
		isLoading,
		observerRef,
		staticMode,
	}
}
