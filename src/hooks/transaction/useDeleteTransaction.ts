'use client'

import { axiosInstance } from '@/lib/fetch'
import { IApiResponse, IDeleteUniversal } from '@/types/api'
import { Transaction } from '@prisma/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const useDeleteTransaction = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (payload: IDeleteUniversal) => {
			const { data } = await axiosInstance.delete(`/transaction/${payload.id}`)

			return data
		},

		onSuccess: (data: IApiResponse<Transaction>) => {
			if (data.success) {
				queryClient.invalidateQueries({ queryKey: ['getTransaction'] })
				toast('Success delete transaction', {
					position: 'top-right',
					closeButton: true,
					className: 'toast--success',
				})
			}
		},
		onError: (error: IApiResponse) => {
			if (!error.success) {
				toast('Error when delete transaction', {
					description: error.error?.message,
					position: 'top-right',
					closeButton: true,
					className: 'toast--error',
				})
			}
		},
	})
}

export default useDeleteTransaction
