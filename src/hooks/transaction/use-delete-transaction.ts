'use client'

import { axiosInstance, handleAxiosError } from '@/lib/fetch'
import { IApiResponse, IIDUniversal } from '@/types/api'
import { Transaction } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

const useDeleteTransaction = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (payload: IIDUniversal) => {
			const { data } = await axiosInstance.delete(`/transaction/${payload.id}`)

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

				toast('Success delete transaction', {
					position: 'top-right',
					closeButton: true,
					className: 'toast--success',
				})
			}
		},
		onError: (error: AxiosError<IApiResponse>) => {
			const errorResponse = handleAxiosError(error)
			if (!errorResponse?.success) {
				toast('Error when delete transaction', {
					description: errorResponse?.error?.message,
					position: 'top-right',
					closeButton: true,
					className: 'toast--error',
				})
			}
		},
	})
}

export default useDeleteTransaction
