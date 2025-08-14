'use client'

import { axiosInstance } from '@/lib/fetch'
import { IApiResponse } from '@/types/api'
import { ITransactionQuery } from '@/types/transaction/api'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

const useExportTransaction = () => {
	return useMutation({
		mutationFn: async (payload: Omit<ITransactionQuery, 'limit' | 'page'>) => {
			const { data } = await axiosInstance.get('/export/transaction', {
				params: payload,
			})

			return data
		},

		onError: (error: IApiResponse) => {
			if (!error.success) {
				toast('Error when export transaction', {
					description: error.error?.message,
					position: 'top-right',
					closeButton: true,
					className: 'toast--error',
				})
			}
		},
	})
}

export default useExportTransaction
