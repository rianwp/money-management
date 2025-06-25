import { z } from 'zod'

const TransactionTypeSchema = z.enum(['INCOME', 'EXPENSE'])

export const transactionSchema = z.object({
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

export const transactionQuerySchema = z.object({
	type: TransactionTypeSchema.optional(),
	sort: z.enum(['asc', 'desc']).optional(),
	search: z.string().min(3, 'Search need 3 keyword').optional(),
})

export type ITransactionRequest = z.infer<typeof transactionSchema>
export type ITransactionQuery = z.infer<typeof transactionQuerySchema>
