'use client'

import AuthForm from '@/components/Auth/AuthForm'
import AuthPage from '@/components/Auth/AuthPage'
import useSignUp from '@/hooks/auth/useSignUp'
import { IRegisterRequest, registerSchema } from '@/types/Auth/api'
import { IAuthFormComponentData } from '@/types/Auth/authForm'

const Page = () => {
	const { mutateAsync, isPending } = useSignUp()
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

export default Page
