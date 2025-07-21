import { z } from 'zod'
import { baseQuerySchema, updateSchema } from '../api'

const TransactionTypeSchema = z.enum(['INCOME', 'EXPENSE'])

export const categoryCreateSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	icon: z.string().optional(),
	type: TransactionTypeSchema,
	description: z
		.string()
		.min(1, 'Description cannot be empty')
		.max(75, 'Description must less than 75 character')
		.optional(),
	monthlyTarget: z
		.number()
		.int()
		.positive('Monthly target must be a positive integer')
		.optional(),
})

export const categoryUpdateSchema = updateSchema(categoryCreateSchema)

export const categoryQuerySchema = baseQuerySchema.extend({
	type: TransactionTypeSchema.nullable().optional(),
})

export type ICategoryCreateRequest = z.infer<typeof categoryCreateSchema>
export type ICategoryUpdateRequest = z.infer<typeof categoryUpdateSchema>
export type ICategoryQuery = z.infer<typeof categoryQuerySchema>
