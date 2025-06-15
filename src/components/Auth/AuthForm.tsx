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

interface IAuthFormProps {
	data: IAuthFormComponentData
}

const AuthForm = ({ data }: IAuthFormProps) => {
	const form = useForm<ILoginRequest | IRegisterRequest>({
		resolver: zodResolver(data.formSchema),
		defaultValues: data.inputField.reduce((acc, field) => {
			return { ...acc, [field.name]: '' }
		}, {}),
	})

	const onSubmit = (values: ILoginRequest | IRegisterRequest) => {
		data.submitFn(values)
	}
	return (
		<Card className="flex flex-col gap-y-4 px-12 py-8">
			<h1 className="font-bold text-center text-2xl self-center">
				{data.submitCta}
			</h1>
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
					<Button type="submit">{data.submitCta}</Button>
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
