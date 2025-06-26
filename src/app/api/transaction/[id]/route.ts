import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { handleError } from '@/lib/error'
import { validateZod } from '@/lib/validation'
import { IApiParams, IApiResponse } from '@/types/api'
import { transactionUpdateSchema } from '@/types/Transaction/api'
import { User as UserAuth } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export const PUT = async (
	req: NextRequest,
	{ params }: IApiParams<{ id: string }>
): Promise<NextResponse<IApiResponse>> => {
	try {
		const { id: userId } = (await getCurrentUser()) as UserAuth

		const { id } = await params
		const body = await req.json()
		const { categoryId, title, type, date, description, amount } = validateZod(
			transactionUpdateSchema,
			body
		)

		const transaction = await prisma.transaction.update({
			where: {
				id: Number(id),
				userId: Number(userId),
			},
			data: {
				amount,
				title,
				description,
				type,
				date,
				categoryId,
			},
		})

		return NextResponse.json(
			{
				success: true,
				data: transaction,
			},
			{
				status: 200,
			}
		)
	} catch (error) {
		return handleError(error)
	}
}
