'use client'

import { axiosInstance } from '@/lib/fetch'
import { IApiResponse } from '@/types/api'
import { IRegisterRequest } from '@/types/Auth/api'
import { User } from '@prisma/client'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const useSignUp = () => {
	const router = useRouter()
	return useMutation({
		mutationFn: async (payload: IRegisterRequest) => {
			const { data } = await axiosInstance.post('/auth/register', payload)

			return data
		},

		onSuccess: (data: IApiResponse<Omit<User, 'password'>>) => {
			if (data.success) {
				router.push('/sign-in')
			}
		},
		onError: (error: IApiResponse) => {
			if (!error.success) {
				toast('Error when sign up', {
					description: error.error?.message,
					position: 'top-right',
					closeButton: true,
					className: 'toast--error',
				})
			}
		},
	})
}

export default useSignUp
