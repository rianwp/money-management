import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { handleError } from '@/lib/error'
import { validateZod } from '@/lib/validation'
import { IApiResponse } from '@/types/api'
import { categoryQuerySchema } from '@/types/category/api'
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
		})

		const category = await prisma.category.findMany({
			where: {
				userId: Number(userId),
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
			take: Number(query.limit) || undefined,
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
