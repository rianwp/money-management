'use client'

import { axiosInstance } from '@/lib/fetch'
import { IApiResponse } from '@/types/api'
import { ITransactionCreateRequest } from '@/types/transaction/api'
import { Transaction } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const useCreateTransaction = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (payload: ITransactionCreateRequest) => {
			const { data } = await axiosInstance.post('/transaction', payload)

			return data
		},

		onSuccess: (data: IApiResponse<Transaction>) => {
			queryClient.invalidateQueries({
				queryKey: ['getTransaction'],
				exact: false
			})
			queryClient.invalidateQueries({
				queryKey: ['getUserGrowth'],
				exact: false
			})
			queryClient.invalidateQueries({
				queryKey: ['getUserBalances'],
				exact: false
			})
			if (data.success) {
				toast('Success add transaction', {
					position: 'top-right',
					closeButton: true,
					className: 'toast--success',
				})
			}
		},
		onError: (error: IApiResponse) => {
			if (!error.success) {
				toast('Error when add transaction', {
					description: error.error?.message,
					position: 'top-right',
					closeButton: true,
					className: 'toast--error',
				})
			}
		},
	})
}

export default useCreateTransaction
