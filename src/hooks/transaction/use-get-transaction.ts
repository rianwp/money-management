'use client'

import { axiosInstance } from '@/lib/fetch'
import { IApiResponse } from '@/types/api'
import { ITransactionQuery } from '@/types/transaction/api'
import { Prisma } from '@prisma/client'
import { useInfiniteQuery } from '@tanstack/react-query'

const PAGE_SIZE = 10

const useGetTransaction = (query: ITransactionQuery = {}) => {
	return useInfiniteQuery<
		IApiResponse<
			Prisma.TransactionGetPayload<{
				include: {
					category: true
				}
			}>[]
		>,
		IApiResponse
	>({
		queryKey: ['getTransaction', query],
		queryFn: async ({ pageParam = 1 }) => {
			const { data } = await axiosInstance.get('/transaction', {
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

export default useGetTransaction
