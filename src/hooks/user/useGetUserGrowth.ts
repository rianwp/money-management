'use client'

import { axiosInstance } from '@/lib/fetch'
import { IApiResponse } from '@/types/api'
import { IUserGrowth } from '@/types/user/api'
import { useQuery } from '@tanstack/react-query'

const useGetUserGrowth = () => {
	return useQuery<IApiResponse<IUserGrowth>, IApiResponse>({
		queryKey: ['getUserGrowth'],
		queryFn: async () => {
			const { data } = await axiosInstance.get('/user/monthly-growth')

			return data
		},
	})
}

export default useGetUserGrowth
