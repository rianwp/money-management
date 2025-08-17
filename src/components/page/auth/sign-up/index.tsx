'use client'

import AuthForm from '@/components/auth/auth-form'
import AuthPage from '@/components/auth/auth-page'
import useSignUp from '@/hooks/auth/use-sign-up'
import { IRegisterRequest, registerSchema } from '@/types/auth/api'
import { IAuthFormComponentData } from '@/types/auth/auth-form'
import { useMemo } from 'react'

const SignUpPage = () => {
	const { mutateAsync, status, data } = useSignUp()
	const isPending = useMemo(
		() => status !== 'error' && status !== 'idle' && !data?.error,
		[status, data]
	)
	const componentData: IAuthFormComponentData = {
		submitCta: 'Sign Up',
		inputField: [
			{
				name: 'name',
				label: 'Fullname',
				placeholder: 'Fullname',
				type: 'text',
			},
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
			{
				name: 'phone',
				label: 'Phone',
				placeholder: 'Phone',
				type: 'tel',
			},
		],
		submitFn: async (values) => {
			return await mutateAsync(values as IRegisterRequest)
		},
		redirectCta: {
			ctaText: 'Already have an account?',
			href: '/sign-in',
			name: 'Sign In',
		},
		formSchema: registerSchema,
	}

	return (
		<AuthPage>
			<AuthForm data={componentData} isPending={isPending} />
		</AuthPage>
	)
}

export default SignUpPage
