'use client'

import AuthForm from '@/components/Auth/AuthForm'
import AuthPage from '@/components/Auth/AuthPage'
import { loginSchema } from '@/types/Auth/api'
import { IAuthFormComponentData } from '@/types/Auth/authForm'

const Page = () => {
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
		submitFn: () => {},
		redirectCta: {
			ctaText: `Don't have an account?`,
			href: '/sign-up',
			name: 'Sign Up',
		},
		formSchema: loginSchema,
	}
	return (
		<AuthPage>
			<AuthForm data={componentData} />
		</AuthPage>
	)
}

export default Page
