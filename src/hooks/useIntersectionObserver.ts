'use client'

import { useEffect, useRef, useCallback } from 'react'

const useIntersectionObserver = <T extends HTMLElement>(
	onIntersect: () => void,
	options?: IntersectionObserverInit
) => {
	const observerRef = useRef<T>(null)

	const handleObserver = useCallback(
		(entries: IntersectionObserverEntry[]) => {
			const [entry] = entries
			if (entry.isIntersecting) {
				onIntersect()
			}
		},
		[onIntersect]
	)

	useEffect(() => {
		if (!observerRef.current) return

		const observer = new IntersectionObserver(handleObserver, options)
		observer.observe(observerRef.current)

		return () => {
			if (observerRef.current) {
				observer.unobserve(observerRef.current)
			}
		}
	}, [handleObserver, options])

	return observerRef
}

export default useIntersectionObserver
