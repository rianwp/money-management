'use client'

import { axiosInstance } from '@/lib/fetch'
import { IApiResponse } from '@/types/api'
import { IUserBalance } from '@/types/user/api'
import { useQuery } from '@tanstack/react-query'

const useGetUserBalance = () => {
	return useQuery<IApiResponse<IUserBalance>, IApiResponse>({
		queryKey: ['getUserBalance'],
		queryFn: async () => {
			const { data } = await axiosInstance.get('/user/balance')

			return data
		},
	})
}

export default useGetUserBalance
