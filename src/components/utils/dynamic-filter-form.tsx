'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
	Form,
	FormField,
	FormItem,
	FormLabel,
	FormControl,
	FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import DatePicker from '@/components/utils/date-picker'
import { IFilterField } from '@/types/form'
import { TransactionType } from '@prisma/client'

interface IDynamicFilterFormProps {
	fields: IFilterField[]
	onSubmit: (values: Record<string, any>) => void
	defaultValues?: Record<string, any>
}

const DynamicFilterForm = ({
	fields,
	onSubmit,
	defaultValues,
}: IDynamicFilterFormProps) => {
	// Create dynamic schema based on fields
	const schemaFields: Record<string, z.ZodTypeAny> = {}
	fields.forEach((field) => {
		switch (field.fieldType) {
			case 'date':
			case 'date-range':
				schemaFields[field.name] = z
					.object({
						from: z.coerce.date().nullable().optional(),
						to: z.coerce.date().nullable().optional(),
					})
					.optional()
				break
			case 'number':
				schemaFields[field.name] = z.number().nullable().optional()
				break
			case 'select':
			case 'type-select':
			case 'sort-select':
				schemaFields[field.name] = z.string().nullable().optional()
				break
			default:
				schemaFields[field.name] = z.string().nullable().optional()
		}
	})

	const formSchema = z.object(schemaFields)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: defaultValues || {},
	})

	// Handle form submission
	const handleSubmit = (values: z.infer<typeof formSchema>) => {
		onSubmit(values)
	}

	// Render form fields dynamically
	return (
		<Form {...form}>
			<form
				id="dynamic-filter-form"
				onSubmit={form.handleSubmit(handleSubmit, (errors) =>
					console.log(errors)
				)}
				className="space-y-4"
			>
				{fields.map((field) => (
					<FormField
						key={field.name}
						control={form.control}
						name={field.name}
						render={({ field: formField }) => (
							<FormItem>
								<FormLabel>{field.label}</FormLabel>
								<FormControl>{renderField(field, formField)}</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				))}
			</form>
		</Form>
	)
}

const renderField = (field: IFilterField, formField: any) => {
	switch (field.fieldType) {
		case 'date':
			return (
				<DatePicker date={formField.value} onDateChange={formField.onChange} />
			)
		case 'date-range':
			return (
				<div className="flex flex-col gap-2">
					<div className="flex md:flex-row flex-col gap-2">
						<DatePicker
							date={formField.value?.from}
							onDateChange={(date) => {
								const currentValue = formField.value || {}
								formField.onChange({
									...currentValue,
									from: date,
								})
							}}
						/>
						<DatePicker
							date={formField.value?.to}
							onDateChange={(date) => {
								const currentValue = formField.value || {}
								formField.onChange({
									...currentValue,
									to: date,
								})
							}}
						/>
					</div>
				</div>
			)
		case 'select':
			return (
				<Select value={formField.value} onValueChange={formField.onChange}>
					<SelectTrigger>
						<SelectValue placeholder={field.placeholder} />
					</SelectTrigger>
					<SelectContent>
						{field.options?.map((option) => (
							<SelectItem key={option.value} value={option.value}>
								{option.label}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			)
		case 'type-select':
			return (
				<Select value={formField.value} onValueChange={formField.onChange}>
					<SelectTrigger>
						<SelectValue placeholder={field.placeholder} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={TransactionType.INCOME}>Income</SelectItem>
						<SelectItem value={TransactionType.EXPENSE}>Expense</SelectItem>
					</SelectContent>
				</Select>
			)
		case 'sort-select':
			return (
				<Select value={formField.value} onValueChange={formField.onChange}>
					<SelectTrigger>
						<SelectValue placeholder={field.placeholder} />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="desc">Newest First</SelectItem>
						<SelectItem value="asc">Oldest First</SelectItem>
					</SelectContent>
				</Select>
			)
		default:
			return (
				<Input
					placeholder={field.placeholder}
					type={field.type}
					{...formField}
				/>
			)
	}
}

export default DynamicFilterForm
