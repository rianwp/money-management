import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { handleError } from '@/lib/error'
import { validateZod } from '@/lib/validation'
import { IApiResponse } from '@/types/api'
import {
	transactionQuerySchema,
	transactionCreateSchema,
} from '@/types/transaction/api'
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

		const transaction = await prisma.transaction.create({
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

		const updateSummary =
			type === 'INCOME'
				? {
						totalIncome: {
							increment: amount,
						},
				  }
				: {
						totalOutcome: {
							increment: amount,
						},
				  }

		await prisma.userSummary.update({
			where: {
				userId: Number(userId),
			},
			data: updateSummary,
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
