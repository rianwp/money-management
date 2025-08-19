import { z } from 'zod'
import { baseQuerySchema, updateSchema } from '../api'
import { Prisma } from '@prisma/client'

const TransactionTypeSchema = z.enum(['INCOME', 'EXPENSE'])

export const categoryCreateSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	icon: z.string().optional(),
	type: TransactionTypeSchema,
	description: z.string().optional(),
	monthlyTarget: z
		.number()
		.positive('Monthly target must be a positive number')
		.nullable()
		.optional(),
	target: z
		.number()
		.positive('Target must be a positive number')
		.optional()
		.nullable(),
})

export const categoryUpdateSchema = updateSchema(categoryCreateSchema)

export const categoryQuerySchema = baseQuerySchema.extend({
	type: TransactionTypeSchema.nullable().optional(),
	include: z
		.string()
		.refine(
			(str) => {
				const values = str.split(',')
				return values.every((v) =>
					[
						'transactions_count',
						'transactions_amount',
						'last_activity',
						'monthly_budget',
					].includes(v.trim())
				)
			},
			{
				message:
					'Include must contain valid values: transactions_count, transactions_amount, last_activity, monthly_budget',
			}
		)
		.nullable()
		.optional(),
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
})

export type ICategoryCreateRequest = z.infer<typeof categoryCreateSchema>
export type ICategoryUpdateRequest = z.infer<typeof categoryUpdateSchema>
export type ICategoryQuery = z.infer<typeof categoryQuerySchema>
export type ICategoryResponse = (Prisma.CategoryGetPayload<{
	include: {
		_count: {
			select: {
				transactions: true
			}
		}
	}
}> & {
	transactionsAmount?: number
	lastActivity?: Date
	monthlyBudget?: number
})[]
