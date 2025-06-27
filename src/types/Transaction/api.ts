import { z } from 'zod'
import { baseQuerySchema, updateSchema } from '../api'

const TransactionTypeSchema = z.enum(['INCOME', 'EXPENSE'])

export const transactionCreateSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	categoryId: z
		.number()
		.int()
		.positive('Category ID must be a positive integer'),
	description: z
		.string()
		.min(1, 'Description cannot be empty')
		.max(75, 'Description must less than 75 character')
		.optional(),
	type: TransactionTypeSchema,
	date: z
		.date({
			required_error: 'Date is required',
			invalid_type_error: 'Date must be a valid date',
		})
		.optional(),
	amount: z.number().int().positive('Amount must be a positive integer'),
})

export const transactionUpdateSchema = updateSchema(transactionCreateSchema)

export const transactionQuerySchema = baseQuerySchema.extend({
	type: TransactionTypeSchema.nullable().optional(),
})

export type ITransactionCreateRequest = z.infer<typeof transactionCreateSchema>
export type ITransactionUpdateRequest = z.infer<typeof transactionUpdateSchema>
export type ITransactionQuery = z.infer<typeof transactionQuerySchema>
