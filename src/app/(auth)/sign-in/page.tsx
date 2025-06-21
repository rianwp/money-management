'use client'

import AuthForm from '@/components/Auth/AuthForm'
import AuthPage from '@/components/Auth/AuthPage'
import { loginSchema } from '@/types/Auth/api'
import { IAuthFormComponentData } from '@/types/Auth/authForm'
import useSignIn from '@/hooks/auth/useSignIn'

const Page = () => {
	const { mutateAsync, isPending } = useSignIn()
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
