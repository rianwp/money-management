import { z } from 'zod'
import { baseQuerySchema, updateSchema } from '../api'
import { TransactionType } from '@prisma/client'

export const transactionTypeSchema = z.enum([
	TransactionType.INCOME,
	TransactionType.EXPENSE,
	TransactionType.ALLOCATION,
])

export const transactionCreateSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	categoryId: z.number().positive('Category is required'),
	description: z.string().optional(),
	type: transactionTypeSchema,
	date: z.coerce
		.date({
			required_error: 'Date is required',
			invalid_type_error: 'Date must be a valid date',
		})
		.optional(),
	amount: z
		.number({
			invalid_type_error: 'Amount must be a positive number',
		})
		.positive('Amount must be a positive number'),
})

export const transactionUpdateSchema = updateSchema(transactionCreateSchema)

export const transactionQuerySchema = baseQuerySchema.extend({
	type: transactionTypeSchema.nullable().optional(),
	startDate: z.coerce
		.date({
			invalid_type_error: 'Start date must be a valid date',
		})
		.nullable()
		.optional(),
	endDate: z.coerce
		.date({
			invalid_type_error: 'Start date must be a valid date',
		})
		.nullable()
		.optional(),
	categoryId: z.coerce
		.number()
		.int()
		.positive('Category id is not valid')
		.nullable()
		.optional(),
})

export type ITransactionCreateRequest = z.infer<typeof transactionCreateSchema>
export type ITransactionUpdateRequest = z.infer<typeof transactionUpdateSchema>
export type ITransactionQuery = z.infer<typeof transactionQuerySchema>
