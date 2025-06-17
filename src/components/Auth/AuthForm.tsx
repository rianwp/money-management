'use client'

import { ILoginRequest, IRegisterRequest } from '@/types/Auth/api'
import { Button } from '../ui/button'
import { IAuthFormComponentData } from '@/types/Auth/authForm'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { Card } from '../ui/card'
import { useMutation } from '@tanstack/react-query'
import ButtonLoader from '../Utils/ButtonLoader'
import { toast } from 'sonner'
import '@/assets/style/toast.css'
import { AuthError } from 'next-auth'
import { useState } from 'react'

interface IAuthFormProps {
	data: IAuthFormComponentData
}

const AuthForm = ({ data }: IAuthFormProps) => {
	const [error, setError] = useState<string>('')
	const form = useForm<ILoginRequest | IRegisterRequest>({
		resolver: zodResolver(data.formSchema),
		defaultValues: data.inputField.reduce((acc, field) => {
			return { ...acc, [field.name]: '' }
		}, {}),
	})

	const { mutateAsync, isPending } = useMutation({
		mutationFn: data.submitFn,
	})

	const onSubmit = async (values: ILoginRequest | IRegisterRequest) => {
		setError('')
		try {
			const res = (await mutateAsync(values)) as {
				error: string
			}
			if (res.error === 'CredentialsSignin') {
				setError('Invalid email or password')
			}
		} catch (error) {
			if (error instanceof AuthError) {
				setError('Invalid email or password')
			}

			throw error
		}

		if (error) {
			toast('Error when sign in', {
				description: error,
				position: 'top-right',
				closeButton: true,
				className: 'toast--error',
			})
		}
	}
	return (
		<Card className="flex flex-col gap-y-4 px-12 py-8">
			<h2 className="font-bold text-center text-2xl self-center">
				{data.submitCta}
			</h2>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
					{data.inputField.map((item) => (
						<FormField
							key={item.name}
							control={form.control}
							name={item.name as 'email' | 'password' | 'name' | 'phone'}
							render={({ field }) => (
								<FormItem>
									<FormLabel>{item.label}</FormLabel>
									<FormControl>
										<Input
											placeholder={item.placeholder}
											type={item.type}
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					))}
					<Button
						type="submit"
						size="lg"
						className="w-full bg-blue-600 hover:bg-blue-700"
						disabled={isPending}
					>
						<span>{data.submitCta}</span>
						<ButtonLoader className="ml-2" isLoading={isPending} />
					</Button>
				</form>
			</Form>

			<div className="text-center text-sm">
				<span>{data.redirectCta.ctaText} </span>
				<Link href={data.redirectCta.href} className="font-medium">
					{data.redirectCta.name}
				</Link>
			</div>
		</Card>
	)
}

export default AuthForm
