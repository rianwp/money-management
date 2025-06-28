'use client'

import { axiosInstance } from '@/lib/fetch'
import { IApiResponse } from '@/types/api'
import { ICategoryQuery } from '@/types/category/api'
import { Category } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'

const useGetCategory = (query: ICategoryQuery = {}) => {
	return useQuery<IApiResponse<Category[]>, IApiResponse>({
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
