import { z } from 'zod'

export interface IApiResponse<T = object> {
	success: boolean
	data?: T
	error?: {
		code: string
		message: string
	}
}

export interface IApiParams<T = object> {
	params: Promise<T>
}

export const baseQuerySchema = z.object({
	sort: z.enum(['asc', 'desc']).nullable().optional(),
	search: z.string().min(3, 'Search need 3 keyword').nullable().optional(),
	page: z.coerce
		.number()
		.int()
		.positive('Page must a number')
		.nullable()
		.optional(),
	limit: z.coerce
		.number()
		.int()
		.positive('Limit must a number')
		.nullable()
		.optional(),
})

export const updateSchema = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) =>
	schema.partial().refine((data) => Object.keys(data).length > 0, {
		message: 'At least one field must be provided for update',
	})
