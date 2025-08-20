import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { handleError } from '@/lib/error'
import { validateZod } from '@/lib/validation'
import { IApiParams, IApiResponse } from '@/types/api'
import { transactionUpdateSchema } from '@/types/transaction/api'
import { TransactionType, UserSummary } from '@prisma/client'
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
			const userSummary = (await tx.userSummary.findUnique({
				where: {
					userId: Number(userId),
				},
			})) as UserSummary

			const availableBalance =
				Number(userSummary?.totalIncome) -
				Number(userSummary?.totalOutcome) -
				Number(userSummary?.totalAllocation)

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

			let incomeChange = 0
			let outcomeChange = 0
			let allocationChange = 0

			if (amount) {
				if (originalTransaction.type === TransactionType.INCOME) {
					incomeChange -= Number(originalTransaction.amount)
				} else if (originalTransaction.type === TransactionType.EXPENSE) {
					outcomeChange -= Number(originalTransaction.amount)
				} else if (originalTransaction.type === TransactionType.ALLOCATION) {
					allocationChange -= Number(originalTransaction.amount)
				}

				if (type === TransactionType.INCOME) {
					incomeChange += Number(amount)
				} else if (type === TransactionType.EXPENSE) {
					const newOutcomeAmount = Number(amount)
					const effectiveBalance = availableBalance - outcomeChange

					if (effectiveBalance < newOutcomeAmount) {
						throw new Error(
							`Insufficient funds. Available: Rp${effectiveBalance.toLocaleString()}, ` +
								`Required: Rp${newOutcomeAmount.toLocaleString()}. ` +
								`Consider reducing allocations first.`
						)
					}
					outcomeChange += newOutcomeAmount
				} else if (type === TransactionType.ALLOCATION) {
					const newAllocationAmount = Number(amount)
					const effectiveBalance = availableBalance - allocationChange

					if (effectiveBalance < newAllocationAmount) {
						throw new Error(
							`Insufficient balance for allocation. Available: Rp${effectiveBalance.toLocaleString()}, ` +
								`Required: Rp${newAllocationAmount.toLocaleString()}`
						)
					}

					allocationChange += newAllocationAmount
				}

				if (
					incomeChange !== 0 ||
					outcomeChange !== 0 ||
					allocationChange !== 0
				) {
					const updateIncome =
						incomeChange !== 0
							? { totalIncome: { increment: incomeChange } }
							: {}

					const updateOutcome =
						outcomeChange !== 0
							? { totalOutcome: { increment: outcomeChange } }
							: {}

					const updateAllocation =
						allocationChange !== 0
							? { totalAllocation: { increment: allocationChange } }
							: {}

					await tx.userSummary.update({
						where: { userId: Number(userId) },
						data: {
							...updateIncome,
							...updateOutcome,
							...updateAllocation,
						},
					})
				}
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

export const DELETE = async (
	req: NextRequest,
	{ params }: IApiParams<{ id: string }>
): Promise<NextResponse<IApiResponse>> => {
	try {
		const { id: userId } = (await getCurrentUser()) as UserAuth

		const { id } = await params

		await prisma.$transaction(async (tx) => {
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

			const updatedTransaction = await tx.transaction.delete({
				where: {
					id: Number(id),
				},
			})

			let incomeChange = 0
			let outcomeChange = 0
			let allocationChange = 0

			if (originalTransaction.type === 'INCOME') {
				incomeChange -= Number(originalTransaction.amount)
			} else if (originalTransaction.type === 'EXPENSE') {
				outcomeChange -= Number(originalTransaction.amount)
			} else if (originalTransaction.type === 'ALLOCATION') {
				allocationChange -= Number(originalTransaction.amount)
			}

			if (incomeChange !== 0 || outcomeChange !== 0 || allocationChange !== 0) {
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

				const updateAllocation =
					allocationChange !== 0
						? {
								totalAllocation: { increment: allocationChange },
						  }
						: {}

				await tx.userSummary.update({
					where: { userId: Number(userId) },
					data: {
						...updateIncome,
						...updateOutcome,
						...updateAllocation,
					},
				})
			}

			return updatedTransaction
		})

		return NextResponse.json(
			{
				success: true,
			},
			{
				status: 200,
			}
		)
	} catch (error) {
		return handleError(error)
	}
}
