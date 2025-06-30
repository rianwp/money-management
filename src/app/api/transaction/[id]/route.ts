import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { handleError } from '@/lib/error'
import { validateZod } from '@/lib/validation'
import { IApiParams, IApiResponse } from '@/types/api'
import { transactionUpdateSchema } from '@/types/transaction/api'
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

		const transaction = await prisma.$transaction(async (tx) => {
			const originalTransaction = await tx.transaction.findUnique({
				where: {
					id: Number(id),
					userId: Number(userId),
				},
				select: {
					amount: true,
					type: true,
				},
			})

			if (!originalTransaction) {
				throw new Error('Transaction not found')
			}

			// Update the transaction
			const updatedTransaction = await tx.transaction.update({
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

			// Calculate and apply summary changes
			let incomeChange = 0
			let outcomeChange = 0

			if (originalTransaction.type === 'INCOME') {
				incomeChange -= Number(originalTransaction.amount)
			} else {
				outcomeChange -= Number(originalTransaction.amount)
			}

			if (type === 'INCOME') {
				incomeChange += Number(amount)
			} else {
				outcomeChange += Number(amount)
			}

			if (incomeChange !== 0 || outcomeChange !== 0) {
				const updateIncome =
					incomeChange !== 0
						? {
								totalIncome: { increment: incomeChange },
						  }
						: {}

				const updateOutcome =
					outcomeChange !== 0
						? {
								totalOutcome: { increment: outcomeChange },
						  }
						: {}

				await tx.userSummary.update({
					where: { userId: Number(userId) },
					data: {
						...updateIncome,
						...updateOutcome,
					},
				})
			}

			return updatedTransaction
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
