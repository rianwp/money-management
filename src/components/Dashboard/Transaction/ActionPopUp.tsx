'use client'

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import ButtonLoader from '@/components/utils/ButtonLoader'
import { TransactionType } from '@prisma/client'
import { MinusCircle, PlusCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { IInputField } from '@/types/form'
import {
	ITransactionCreateRequest,
	transactionCreateSchema,
} from '@/types/transaction/api'
import DatePicker from '@/components/utils/DatePicker'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import useGetCategory from '@/hooks/category/useGetCategory'
import SectionLoader from '@/components/utils/SectionLoader'
import useCreateTransaction from '@/hooks/transaction/useCreateTransaction'
import { useEffect } from 'react'

interface IActionPopUpProps {
	type: TransactionType
}

const ActionPopUp = ({ type }: IActionPopUpProps) => {
	const { data: category, isLoading: isCategoryLoading } = useGetCategory({
		type,
	})
	const { mutateAsync, isPending: isTransactionPending } =
		useCreateTransaction()

	const typeAction = {
		INCOME: {
			button: (
				<ButtonLoader variant="success" icon={<PlusCircle />}>
					Add Income
				</ButtonLoader>
			),
			title: 'Add Income',
		},
		EXPENSE: {
			button: (
				<ButtonLoader variant="destructive" icon={<MinusCircle />}>
					Add Expense
				</ButtonLoader>
			),
			title: 'Add Expense',
		},
	}

	const inputField: IInputField[] = [
		{
			name: 'title',
			label: 'Title',
			placeholder: 'Enter transaction title',
			type: 'text',
		},
		{
			name: 'amount',
			label: 'Amount',
			placeholder: 'Enter amount',
			type: 'number',
		},
		{
			name: 'description',
			label: 'Description',
			placeholder: 'Enter description (optional)',
			type: 'text',
		},
	]

	const form = useForm<Omit<ITransactionCreateRequest, 'type'>>({
		resolver: zodResolver(
			transactionCreateSchema.omit({
				type: true,
			})
		),
		defaultValues: {
			...inputField.reduce((acc, field) => {
				return { ...acc, [field.name]: '' }
			}, {}),
			categoryId: category?.data?.[0].id,
			date: new Date(),
		},
	})

	useEffect(() => {
		if (category?.data?.length && !form.getValues('categoryId')) {
			const firstCategoryId = String(category.data[0].id)
			form.setValue('categoryId', Number(firstCategoryId))
		}
	}, [category, form])

	const onSubmit = async (values: Omit<ITransactionCreateRequest, 'type'>) => {
		await mutateAsync({
			...values,
			type,
			categoryId: Number(values.categoryId),
		})
	}

	return (
		<Dialog>
			<DialogTrigger asChild>{typeAction[type].button}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{typeAction[type].title}</DialogTitle>
					<DialogDescription>Add some transaction</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
						{inputField.map((item) => (
							<FormField
								key={item.name}
								control={form.control}
								name={
									item.name as keyof Omit<
										ITransactionCreateRequest,
										'type' | 'date' | 'categoryId'
									>
								}
								render={({ field }) => (
									<FormItem>
										<FormLabel>{item.label}</FormLabel>
										<FormControl>
											<div className="flex flex-row items-center gap-x-2">
												{item.name === 'amount' ? (
													<span className="text-gray-500">Rp</span>
												) : null}
												<Input
													placeholder={item.placeholder}
													type={item.type}
													{...field}
												/>
											</div>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						))}

						<FormField
							control={form.control}
							name="categoryId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Category</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={String(field.value)}
										value={String(field.value)}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="Select a category" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{!isCategoryLoading ? (
												category?.data?.map((item) => (
													<SelectItem key={item.id} value={String(item.id)}>
														{item.name}
													</SelectItem>
												))
											) : (
												<SectionLoader />
											)}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="date"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Date</FormLabel>
									<FormControl>
										<DatePicker
											date={field.value || new Date()}
											onDateChange={field.onChange}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>

				<DialogFooter>
					<DialogClose asChild>
						<Button variant="outline">Cancel</Button>
					</DialogClose>
					<ButtonLoader type="submit" isLoading={isTransactionPending}>
						Add
					</ButtonLoader>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}

export default ActionPopUp
