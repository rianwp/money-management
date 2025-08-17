'use client'

import { axiosInstance, handleAxiosError } from '@/lib/fetch'
import { formatDate } from '@/lib/utils'
import { IApiResponse } from '@/types/api'
import { ITransactionQuery } from '@/types/transaction/api'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

const useExportTransaction = () => {
	return useMutation({
		mutationFn: async (payload: Omit<ITransactionQuery, 'limit' | 'page'>) => {
			const { data, headers } = await axiosInstance.get('/transaction/export', {
				params: payload,
				responseType: 'blob',
			})

			const contentDisposition = headers['content-disposition']
			let filename = `transactions_export_${formatDate(new Date())}.xlsx`

			if (contentDisposition) {
				const filenameMatch = contentDisposition.match(
					/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
				)
				if (filenameMatch && filenameMatch[1]) {
					filename = filenameMatch[1].replace(/['"]/g, '')
				}
			}

			const blob = new Blob([data], {
				type: headers['content-type'] || 'application/octet-stream',
			})
			const url = window.URL.createObjectURL(blob)

			const link = document.createElement('a')
			link.href = url
			link.download = filename
			document.body.appendChild(link)
			link.click()

			document.body.removeChild(link)
			window.URL.revokeObjectURL(url)

			return { success: true, filename }
		},

		onSuccess: (data) => {
			toast('Transaction exported successfully', {
				description: `File "${data.filename}" has been downloaded`,
				position: 'top-right',
				closeButton: true,
				className: 'toast--success',
			})
		},

		onError: (error: AxiosError<IApiResponse>) => {
			const errorResponse = handleAxiosError(error)
			if (!errorResponse?.success) {
				toast('Error when export transaction', {
					description: errorResponse?.error?.message,
					position: 'top-right',
					closeButton: true,
					className: 'toast--error',
				})
			}
		},
	})
}

export default useExportTransaction
