import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { handleError } from '@/lib/error'
import { validateZod } from '@/lib/validation'
import { IApiResponse } from '@/types/api'
import { categoryCreateSchema, categoryQuerySchema } from '@/types/category/api'
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
		return handleError(error)
	}
}

export const POST = async (
	req: NextRequest
): Promise<NextResponse<IApiResponse>> => {
	try {
		const { id: userId } = (await getCurrentUser()) as UserAuth

		const body = await req.json()
		const { name, type, description, icon, monthlyTarget } = validateZod(
			categoryCreateSchema,
			body
		)

		const category = await prisma.category.create({
			data: {
				name,
				type,
				description,
				icon,
				monthlyTarget,
				userId: Number(userId),
			},
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
		return handleError(error)
	}
}
