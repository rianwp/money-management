'use client'

import { axiosInstance, handleAxiosError } from '@/lib/fetch'
import { IApiResponse, IIDUniversal } from '@/types/api'
import { ICategoryUpdateRequest } from '@/types/category/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'

const useUpdateCategory = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (payload: ICategoryUpdateRequest & IIDUniversal) => {
			const { data } = await axiosInstance.put(
				`/category/${payload.id}`,
				payload
			)
			return data
		},
		onSuccess: (data: IApiResponse) => {
			queryClient.invalidateQueries({ queryKey: ['getCategory'] })
			if (data.success) {
				toast('Success update category', {
					position: 'top-right',
					closeButton: true,
					className: 'toast--success',
				})
			}
		},
		onError: (error: AxiosError<IApiResponse>) => {
			const errorResponse = handleAxiosError(error)
			if (!errorResponse?.success) {
				toast('Error when update category', {
					description: errorResponse?.error?.message,
					position: 'top-right',
					closeButton: true,
					className: 'toast--error',
				})
			}
		},
	})
}

export default useUpdateCategory
