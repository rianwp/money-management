'use client'

import { axiosInstance } from '@/lib/fetch'
import { IApiResponse, IIDUniversal } from '@/types/api'
import { ITransactionUpdateRequest } from '@/types/transaction/api'
import { Transaction } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const useUpdateTransaction = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (payload: ITransactionUpdateRequest & IIDUniversal) => {
			const { data } = await axiosInstance.put(
				`/transaction/${payload.id}`,
				payload
			)

			return data
		},

		onSuccess: (data: IApiResponse<Transaction>) => {
			if (data.success) {
				queryClient.invalidateQueries({
					queryKey: ['getTransaction'],
					exact: false,
				})
				queryClient.invalidateQueries({
					queryKey: ['getUserGrowth'],
					exact: false,
				})
				queryClient.invalidateQueries({
					queryKey: ['getUserBalance'],
					exact: false,
				})

				toast('Success update transaction', {
					position: 'top-right',
					closeButton: true,
					className: 'toast--success',
				})
			}
		},
		onError: (error: IApiResponse) => {
			if (!error.success) {
				toast('Error when update transaction', {
					description: error.error?.message,
					position: 'top-right',
					closeButton: true,
					className: 'toast--error',
				})
			}
		},
	})
}

export default useUpdateTransaction
