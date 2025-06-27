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
		console.log(userId)

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
			limit: searchParams.get('limit'),
		})

		const transaction = await prisma.transaction.findMany({
			where: {
				userId: Number(userId),
				type: query.type || undefined,
				// OR: [
				// 	{
				// 		title: {
				// 			contains: query.search || undefined,
				// 			mode: 'insensitive',
				// 		},
				// 	},
				// 	{
				// 		description: {
				// 			contains: query.search || undefined,
				// 			mode: 'insensitive',
				// 		},
				// 	},
				// ],
			},
			include: {
				category: true,
			},
			orderBy: {
				date: query.sort || 'desc',
			},
			take: Number(query.limit) || undefined,
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
