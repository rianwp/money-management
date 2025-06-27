'use client'

import { ILoginRequest } from '@/types/auth/api'
import { useMutation } from '@tanstack/react-query'
import { signIn, SignInResponse } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const useSignIn = () => {
	const router = useRouter()
	return useMutation({
		mutationFn: async (payload: ILoginRequest) =>
			await signIn('credentials', {
				...payload,
				redirect: false,
			}),
		onSuccess: (data: SignInResponse) => {
			if (!data.error) {
				router.push('/dashboard')
			}

			if (data.error === 'CredentialsSignin') {
				toast('Error when sign in', {
					description: 'Invalid email or password',
					position: 'top-right',
					closeButton: true,
					className: 'toast--error',
				})
			}
		},
		onError: (error: Error) => {
			if (error) {
				toast('Error when sign in', {
					description: error.message,
					position: 'top-right',
					closeButton: true,
					className: 'toast--error',
				})
			}
		},
	})
}

export default useSignIn
