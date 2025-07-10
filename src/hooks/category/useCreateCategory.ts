'use client'

import { axiosInstance } from '@/lib/fetch'
import { IApiResponse } from '@/types/api'
import { ICategoryCreateRequest } from '@/types/category/api'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

const useCreateCategory = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: async (payload: ICategoryCreateRequest) => {
			const { data } = await axiosInstance.post('/category', payload)
			return data
		},
		onSuccess: (data: IApiResponse) => {
			queryClient.invalidateQueries({ queryKey: ['getCategory'] })
			if (data.success) {
				toast('Success add category', {
					position: 'top-right',
					closeButton: true,
					className: 'toast--success',
				})
			}
		},
		onError: (error: IApiResponse) => {
			if (!error.success) {
				toast('Error when add category', {
					description: error.error?.message,
					position: 'top-right',
					closeButton: true,
					className: 'toast--error',
				})
			}
		},
	})
}

export default useCreateCategory
