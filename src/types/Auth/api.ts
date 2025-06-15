import { z } from 'zod'

export interface IAuthRequest {
	email: string
	password: string
	name?: string
	phone?: string
}

const baseAuthSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: z.string().min(8, {
		message: 'Password must be at least 8 characters long',
	}),
})

export const loginSchema = baseAuthSchema

export const registerSchema = baseAuthSchema.extend({
	name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
	phone: z
		.string()
		.regex(/^\+?[0-9]{10,15}$/, {
			message:
				'Invalid phone number format. Use 10-15 digits with optional + prefix',
		})
		.optional(),
})

export type ILoginRequest = z.infer<typeof loginSchema>
export type IRegisterRequest = z.infer<typeof registerSchema>
