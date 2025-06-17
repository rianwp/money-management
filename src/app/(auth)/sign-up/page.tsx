'use client'

import AuthForm from '@/components/Auth/AuthForm'
import AuthPage from '@/components/Auth/AuthPage'
import { registerSchema } from '@/types/Auth/api'
import { IAuthFormComponentData } from '@/types/Auth/authForm'

const Page = () => {
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
			console.log(values)
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
			<AuthForm data={componentData} />
		</AuthPage>
	)
}

export default Page
