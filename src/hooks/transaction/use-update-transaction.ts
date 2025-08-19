'use client'

import { axiosInstance, handleAxiosError } from '@/lib/fetch'
import { IApiResponse, IIDUniversal } from '@/types/api'
import { ITransactionUpdateRequest } from '@/types/transaction/api'
import { Transaction } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
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
				queryClient.invalidateQueries({
					queryKey: ['getCategory'],
					exact: false,
				})

				toast('Success update transaction', {
					position: 'top-right',
					closeButton: true,
					className: 'toast--success',
				})
			}
		},
		onError: (error: AxiosError<IApiResponse>) => {
			const errorResponse = handleAxiosError(error)
			if (!errorResponse?.success) {
				toast('Error when update transaction', {
					description: errorResponse?.error?.message,
					position: 'top-right',
					closeButton: true,
					className: 'toast--error',
				})
			}
		},
	})
}

export default useUpdateTransaction
