'use client'

import { axiosInstance } from '@/lib/fetch'
import { IApiResponse } from '@/types/api'
import { ITransactionCreateRequest } from '@/types/transaction/api'
import { Transaction } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

const useCreateTransaction = () => {
	return useMutation({
		mutationFn: async (payload: ITransactionCreateRequest) => {
			const { data } = await axiosInstance.post('/transaction', payload)

			return data
		},

		onSuccess: (data: IApiResponse<Transaction>) => {
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
