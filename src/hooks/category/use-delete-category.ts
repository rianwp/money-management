'use client'

import { axiosInstance, handleAxiosError } from '@/lib/fetch'
import { IApiResponse, IIDUniversal } from '@/types/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

const useDeleteCategory = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (payload: IIDUniversal) => {
			const { data } = await axiosInstance.delete(`/category/${payload.id}`)
			return data
		},
		onSuccess: (data: IApiResponse) => {
			queryClient.invalidateQueries({ queryKey: ['getCategory'] })
			if (data.success) {
				toast('Success delete category', {
					position: 'top-right',
					closeButton: true,
					className: 'toast--success',
				})
			}
		},
		onError: (error: AxiosError<IApiResponse>) => {
			const errorResponse = handleAxiosError(error)
			if (!errorResponse?.success) {
				toast('Error when delete category', {
					description: errorResponse?.error?.message,
					position: 'top-right',
					closeButton: true,
					className: 'toast--error',
				})
			}
		},
	})
}

export default useDeleteCategory
