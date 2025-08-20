import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { handleError } from '@/lib/error'
import { validateZod } from '@/lib/validation'
import { IApiResponse } from '@/types/api'
import {
	transactionQuerySchema,
	transactionCreateSchema,
} from '@/types/transaction/api'
import { TransactionType } from '@prisma/client'
import { User as UserAuth } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (
	req: NextRequest
): Promise<NextResponse<IApiResponse>> => {
	try {
		const { id: userId } = (await getCurrentUser()) as UserAuth

		const body = await req.json()
		const { categoryId, title, type, date, description, amount } = validateZod(
			transactionCreateSchema,
			body
		)

		const transaction = await prisma.$transaction(async (tx) => {
			const result = await tx.transaction.create({
				data: {
					amount,
					title,
					description,
					type,
					date,
					categoryId,
					userId: Number(userId),
				},
			})

			const userSummary = await tx.userSummary.findUnique({
				where: { userId: Number(userId) },
			})

			if (!userSummary) {
				throw new Error('User summary not found')
			}

			const availableBalance =
				Number(userSummary.totalIncome) -
				Number(userSummary.totalOutcome) -
				Number(userSummary.totalAllocation)

			if (type === TransactionType.ALLOCATION) {
				if (availableBalance < amount) {
					throw new Error(
						`Insufficient funds. Available: Rp${availableBalance.toLocaleString()}, ` +
							`Required: Rp${amount.toLocaleString()}. `
					)
				}

				await tx.userSummary.update({
					where: { userId: Number(userId) },
					data: {
						totalAllocation: {
							increment: amount,
						},
					},
				})
			}

			if (type === TransactionType.EXPENSE) {
				if (availableBalance < amount) {
					throw new Error(
						`Insufficient funds. Available: Rp${availableBalance.toLocaleString()}, ` +
							`Required: Rp${amount.toLocaleString()}. ` +
							`Consider reducing allocations first.`
					)
				}

				await tx.userSummary.update({
					where: { userId: Number(userId) },
					data: { totalOutcome: { increment: amount } },
				})
			}

			if (type === TransactionType.INCOME) {
				await tx.userSummary.update({
					where: { userId: Number(userId) },
					data: { totalIncome: { increment: amount } },
				})
			}

			return result
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

export const GET = async (
	req: NextRequest
): Promise<NextResponse<IApiResponse>> => {
	try {
		const { id: userId } = (await getCurrentUser()) as UserAuth

		const { searchParams } = req.nextUrl

		const query = validateZod(transactionQuerySchema, {
			sort: searchParams.get('sort'),
			type: searchParams.get('type'),
			search: searchParams.get('search'),
			page: searchParams.get('page'),
			limit: searchParams.get('limit'),
			startDate: searchParams.get('startDate'),
			endDate: searchParams.get('endDate'),
			categoryId: searchParams.get('categoryId'),
		})

		const page = Number(query.page) || 1
		const limit = Number(query.limit) || 10
		const skip = (page - 1) * limit

		const transaction = await prisma.transaction.findMany({
			where: {
				userId: Number(userId),
				type: query.type || undefined,
				...(query.search &&
					query.search.trim() !== '' && {
						OR: [
							{
								title: {
									contains: query.search,
									mode: 'insensitive',
								},
							},
							{
								description: {
									contains: query.search,
									mode: 'insensitive',
								},
							},
						],
					}),
				categoryId: query.categoryId ? Number(query.categoryId) : undefined,
				date: {
					gte: query.startDate ? new Date(query.startDate) : undefined,
					lte: query.endDate
						? new Date(new Date(query.endDate).setHours(23, 59, 59, 999))
						: undefined,
				},
			},
			include: {
				category: true,
			},
			orderBy: {
				date: query.sort || 'desc',
			},
			skip,
			take: limit,
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
