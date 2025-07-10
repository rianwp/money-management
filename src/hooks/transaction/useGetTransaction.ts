'use client'

import { axiosInstance } from '@/lib/fetch'
import { IApiResponse } from '@/types/api'
import { ITransactionQuery } from '@/types/transaction/api'
import { Prisma } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'

const useGetTransaction = (query: ITransactionQuery = {}) => {
	return useQuery<
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
		queryFn: async () => {
			const { data } = await axiosInstance.get('/transaction', {
				params: query,
			})
			return data
		},
	})
}

export default useGetTransaction
