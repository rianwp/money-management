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
import { Edit, MinusCircle, Plus, PlusCircle } from 'lucide-react'
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
import useUpdateTransaction from '@/hooks/transaction/useUpdateTransaction'
import { useEffect, useState } from 'react'
import ActionCategoryDialog from '../Category/ActionCategoryDialog'

interface IActionTransactionDialogProps {
	type: TransactionType
	defaultValues?: Partial<Omit<ITransactionCreateRequest, 'type'>> & {
		id?: number
	}
}

const ActionTransactionDialog = ({
	type,
	defaultValues,
}: IActionTransactionDialogProps) => {
	const [open, setOpen] = useState(false)
	const { data: category, isLoading: isCategoryLoading } = useGetCategory({
		type,
	})

	const {
		mutateAsync: createTransaction,
		isPending: isTransactionCreatePending,
	} = useCreateTransaction()
	const {
		mutateAsync: updateTransaction,
		isPending: isTransactionUpdatePending,
	} = useUpdateTransaction()

	const isEditMode = !!defaultValues && typeof defaultValues.id === 'number'

	const editModeButton = (
		<Button variant="outline">
			<Edit />
		</Button>
	)

	const typeAction = {
		INCOME: {
			button: isEditMode ? (
				editModeButton
			) : (
				<ButtonLoader
					variant="success"
					icon={<PlusCircle />}
					isLoading={isTransactionCreatePending}
				>
					Add Income
				</ButtonLoader>
			),
			title: isEditMode ? 'Update Income' : 'Add Income',
		},
		EXPENSE: {
			button: isEditMode ? (
				editModeButton
			) : (
				<ButtonLoader
					variant="destructive"
					icon={<MinusCircle />}
					isLoading={isTransactionCreatePending}
				>
					Add Expense
				</ButtonLoader>
			),
			title: isEditMode ? 'Update Expense' : 'Add Expense',
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

	const form = useForm<ITransactionCreateRequest>({
		resolver: zodResolver(transactionCreateSchema),
		defaultValues: {
			...inputField.reduce((acc, field) => {
				return { ...acc, [field.name]: '' }
			}, {}),
			type: type,
			categoryId: defaultValues?.categoryId || (category?.data?.[0]?.id ?? 0),
			date: new Date(),
			...defaultValues,
		},
	})

	useEffect(() => {
		if (
			category?.data?.length &&
			!form.getValues('categoryId') &&
			!defaultValues?.categoryId
		) {
			const firstCategoryId = String(category.data[0].id)
			form.setValue('categoryId', Number(firstCategoryId))
		}
	}, [category, form, defaultValues?.categoryId])

	const onSubmit = async (values: ITransactionCreateRequest) => {
		if (!values.categoryId || values.categoryId <= 0) {
			form.setError('categoryId', {
				type: 'manual',
				message: 'Please select a category',
			})
			return
		}

		if (isEditMode && defaultValues?.id) {
			await updateTransaction({
				...values,
				type,
				id: defaultValues?.id,
				categoryId: Number(values.categoryId),
			})
		} else {
			const { title = '', amount = 0, categoryId, description, date } = values

			await createTransaction({
				title,
				amount,
				type,
				categoryId: Number(categoryId),
				description,
				date,
			})
		}

		setOpen(false)
		form.reset()
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>{typeAction[type].button}</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>{typeAction[type].title}</DialogTitle>
					<DialogDescription>Add some transaction</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form className="space-y-8">
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
													onChange={(e) =>
														field.onChange(
															e.target.valueAsNumber || e.target.value
														)
													}
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
										onValueChange={(value) => field.onChange(Number(value))}
										value={field.value ? String(field.value) : undefined}
										defaultValue={
											field.value === 0 ? undefined : String(field.value)
										}
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
											<ActionCategoryDialog type={type}>
												<Button className="w-full" size="sm" variant="outline">
													<Plus />
												</Button>
											</ActionCategoryDialog>
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
						<DialogFooter>
							<DialogClose asChild>
								<Button variant="outline">Cancel</Button>
							</DialogClose>
							<ButtonLoader
								type="submit"
								onClick={form.handleSubmit(onSubmit)}
								isLoading={
									isEditMode
										? isTransactionUpdatePending
										: isTransactionCreatePending
								}
							>
								{isEditMode ? 'Update' : 'Add'}
							</ButtonLoader>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	)
}

export default ActionTransactionDialog
