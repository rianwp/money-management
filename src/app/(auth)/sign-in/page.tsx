'use client'

import AuthForm from '@/components/auth/AuthForm'
import AuthPage from '@/components/auth/AuthPage'
import { loginSchema } from '@/types/auth/api'
import { IAuthFormComponentData } from '@/types/auth/authForm'
import useSignIn from '@/hooks/auth/useSignIn'
import { useMemo } from 'react'

const Page = () => {
	const { mutateAsync, status, data } = useSignIn()
	const isPending = useMemo(
		() => status !== 'error' && status !== 'idle' && !data?.error,
		[status, data]
	)
	const componentData: IAuthFormComponentData = {
		submitCta: 'Sign In',
		inputField: [
			{
				name: 'email',
				label: 'Email',
				placeholder: 'Email',
				type: 'email',
			},
			{
				name: 'password',
				label: 'Password',
				placeholder: 'Password',
				type: 'password',
			},
		],
		submitFn: async (values) => {
			return await mutateAsync(values)
		},
		redirectCta: {
			ctaText: `Don't have an account?`,
			href: '/sign-up',
			name: 'Sign Up',
		},
		formSchema: loginSchema,
	}
	return (
		<AuthPage>
			<AuthForm data={componentData} isPending={isPending} />
		</AuthPage>
	)
}

export default Page
