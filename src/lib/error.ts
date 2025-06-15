import { Prisma } from '@prisma/client'
import { ZodError } from 'zod'
import { NextResponse } from 'next/server'
import { IApiResponse } from '@/types/apiResponse'

export type AppError =
	| { type: 'VALIDATION'; error: ZodError }
	| { type: 'DATABASE'; error: Prisma.PrismaClientKnownRequestError }
	| { type: 'INTERNAL'; error: Error }

const classifyError = (error: unknown): AppError => {
	if (error instanceof ZodError) {
		return { type: 'VALIDATION', error }
	}
	if (error instanceof Prisma.PrismaClientKnownRequestError) {
		return { type: 'DATABASE', error }
	}
	return {
		type: 'INTERNAL',
		error: error instanceof Error ? error : new Error(String(error)),
	}
}

export const handleError = (rawError: unknown): NextResponse<IApiResponse> => {
	const error = classifyError(rawError)
	switch (error.type) {
		case 'VALIDATION':
			return NextResponse.json(
				{
					success: false,
					error: {
						code: 'VALIDATION_ERROR',
						message: error.error.errors[0]?.message || 'Validation failed',
					},
				},
				{ status: 400 }
			)

		case 'DATABASE':
			return NextResponse.json(
				{
					success: false,
					error: {
						code: `DB_${error.error.code}`,
						message: 'Database operation failed',
					},
				},
				{ status: 409 }
			)

		case 'INTERNAL':
			return NextResponse.json(
				{
					success: false,
					error: {
						code: 'SERVER_ERROR',
						message:
							process.env.NODE_ENV === 'production'
								? 'Internal server error'
								: error.error.message,
					},
				},
				{ status: 500 }
			)
	}
}
