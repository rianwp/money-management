import { z } from 'zod'
import { updateSchema } from '../api'

const TransactionTypeSchema = z.enum(['INCOME', 'EXPENSE'])

export const transactionCreateSchema = z.object({
	title: z.string().min(1, 'Title is required'),
	categoryId: z
		.number()
		.int()
		.positive('Category ID must be a positive integer'),
	description: z.string().min(1, 'Description cannot be empty').optional(),
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

export const transactionQuerySchema = z.object({
	type: TransactionTypeSchema.optional(),
	sort: z.enum(['asc', 'desc']).optional(),
	search: z.string().min(3, 'Search need 3 keyword').optional(),
})

export type ITransactionCreateRequest = z.infer<typeof transactionCreateSchema>
export type ITransactionUpdateRequest = z.infer<typeof transactionUpdateSchema>
export type ITransactionQuery = z.infer<typeof transactionQuerySchema>
