import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { handleError } from '@/lib/error'
import { validateZod } from '@/lib/validation'
import { IApiResponse } from '@/types/api'
import { categoryCreateSchema, categoryQuerySchema } from '@/types/category/api'
import { Prisma } from '@prisma/client'
import { User as UserAuth } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export const GET = async (
	req: NextRequest
): Promise<NextResponse<IApiResponse>> => {
	try {
		const { id: userId } = (await getCurrentUser()) as UserAuth

		const { searchParams } = req.nextUrl

		const query = validateZod(categoryQuerySchema, {
			sort: searchParams.get('sort'),
			type: searchParams.get('type'),
			search: searchParams.get('search'),
			limit: searchParams.get('limit'),
			page: searchParams.get('page'),
			include: searchParams.get('include'),
		})

		const page = Number(query.page) || 1
		const limit = Number(query.limit) || 10
		const skip = (page - 1) * limit

		const category = await prisma.category.findMany({
			where: {
				userId: Number(userId),
				isActive: true,
				type: query.type || undefined,
				...(query.search &&
					query.search.trim() !== '' && {
						OR: [
							{
								name: {
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
			orderBy: {
				createdAt: query.sort || 'desc',
			},
			skip,
			take: limit,
			include: {
				...(query?.include?.includes('transactions_count') && {
					_count: {
						select: {
							transactions: true,
						},
					},
				}),
				...{
					...(query?.include?.includes('transactions_amount') ||
					query?.include?.includes('last_activity') ||
					query?.include?.includes('monthly_budget')
						? {
								transactions: {
									select: {
										amount: true,
										createdAt: true,
										updatedAt: query?.include?.includes('last_activity'),
									},
									orderBy: {
										updatedAt: 'desc',
									},
								},
						  }
						: {}),
				},
			},
		})

		const transformCategory = (category: any) => {
			const transformed = { ...category }

			if (
				query?.include?.includes('transactions_amount') &&
				category.transactions
			) {
				transformed.transactionsAmount = category.transactions.reduce(
					(sum: number, tx: any) => Number(sum) + (Number(tx.amount) || 0),
					0
				)
			}

			if (query?.include?.includes('monthly_budget') && category.transactions) {
				const startOfMonth = new Date(
					new Date().getFullYear(),
					new Date().getMonth(),
					1
				)
				const endOfMonth = new Date(
					new Date().getFullYear(),
					new Date().getMonth() + 1,
					0
				)
				transformed.monthlyBudget = category.transactions
					.filter((tx: any) => {
						const txDate = new Date(tx.date)
						return txDate >= startOfMonth && txDate <= endOfMonth
					})
					.reduce(
						(sum: number, tx: any) => Number(sum) + (Number(tx.amount) || 0),
						0
					)
			}

			if (
				query?.include?.includes('last_activity') &&
				category.transactions?.length > 0
			) {
				transformed.lastActivity = category.transactions.reduce(
					(latest: any, current: any) =>
						new Date(current.updatedAt) > new Date(latest.updatedAt)
							? current
							: latest
				).updatedAt
			}

			return {
				...transformed,
				transactions: undefined,
			}
		}

		const transformedCategory = category.map(transformCategory)

		return NextResponse.json(
			{
				success: true,
				data: transformedCategory,
			},
			{
				status: 200,
			}
		)
	} catch (error) {
		return handleError(error)
	}
}

export const POST = async (
	req: NextRequest
): Promise<NextResponse<IApiResponse>> => {
	try {
		const { id: userId } = (await getCurrentUser()) as UserAuth

		const body = await req.json()
		const { name, type, description, icon, monthlyTarget, target } =
			validateZod(categoryCreateSchema, body)

		const category = await prisma.$transaction(async (tx) => {
			const categoryExists = await tx.category.findFirst({
				where: {
					userId: Number(userId),
					name,
					type,
				},
			})

			let category

			if (categoryExists) {
				category = await tx.category.update({
					where: { id: categoryExists.id },
					data: {
						isActive: true,
						name,
						type,
						description,
						icon,
						monthlyTarget,
						target,
						userId: Number(userId),
					},
				})
			} else {
				category = await tx.category.create({
					data: {
						name,
						type,
						description,
						icon,
						monthlyTarget,
						target,
						userId: Number(userId),
					},
				})
			}

			return category
		})

		return NextResponse.json(
			{
				success: true,
				data: category,
			},
			{
				status: 200,
			}
		)
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === 'P2002') {
				return NextResponse.json(
					{
						success: false,
						error: {
							code: 'NAME_USED',
							message: 'Name of category already used',
						},
					},
					{
						status: 400,
					}
				)
			}
		}
		return handleError(error)
	}
}
