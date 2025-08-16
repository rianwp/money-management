'use client'

import { axiosInstance } from '@/lib/fetch'
import { IApiResponse } from '@/types/api'
import { ICategoryQuery, ICategoryResponse } from '@/types/category/api'
import { useQuery } from '@tanstack/react-query'

const useGetCategory = (query: ICategoryQuery = {}) => {
	return useQuery<IApiResponse<ICategoryResponse>, IApiResponse>({
		queryKey: ['getCategory', query],
		queryFn: async () => {
			const { data } = await axiosInstance.get('/category', {
				params: query,
			})

			return data
		},
	})
}

export default useGetCategory
