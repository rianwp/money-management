'use client'

import { axiosInstance } from '@/lib/fetch'
import { IApiResponse } from '@/types/api'
import { ICategoryQuery, ICategoryResponse } from '@/types/category/api'
import { useInfiniteQuery } from '@tanstack/react-query'

const PAGE_SIZE = 9

const useLazyGetCategory = (query: ICategoryQuery = {}) => {
	return useInfiniteQuery<IApiResponse<ICategoryResponse>, IApiResponse>({
		queryKey: ['getCategory', query],
		queryFn: async ({ pageParam = 1 }) => {
			const { data } = await axiosInstance.get('/category', {
				params: {
					...query,
					page: pageParam,
					limit: query.limit || PAGE_SIZE,
				},
			})
			return data
		},
		initialPageParam: 1,
		getNextPageParam: (lastPage, allPages) => {
			if (!lastPage.data || lastPage.data.length < PAGE_SIZE) {
				return undefined
			}
			return allPages.length + 1
		},
	})
}

export default useLazyGetCategory
