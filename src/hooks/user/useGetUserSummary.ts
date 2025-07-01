'use client'

import { axiosInstance } from '@/lib/fetch'
import { IApiResponse } from '@/types/api'
import { UserSummary } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'

const useGetUserSummary = () => {
	return useQuery<
		IApiResponse<UserSummary & { totalBalance: number }>,
		IApiResponse
	>({
		queryKey: ['getUserSummary'],
		queryFn: async () => {
			const { data } = await axiosInstance.get('/user/summary')

			return data
		},
	})
}

export default useGetUserSummary
