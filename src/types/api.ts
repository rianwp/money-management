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

export const updateSchema = <T extends z.ZodRawShape>(schema: z.ZodObject<T>) =>
	schema
		.partial()
		.refine((data) => Object.keys(data).length > 0, {
			message: 'At least one field must be provided for update',
		})
