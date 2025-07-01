import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { handleError } from '@/lib/error'
import { IApiResponse } from '@/types/api'
import { User as UserAuth } from 'next-auth'
import { NextResponse } from 'next/server'

export const GET = async (): Promise<NextResponse<IApiResponse>> => {
	try {
		const { id: userId } = (await getCurrentUser()) as UserAuth

		const summary = await prisma.userSummary.findFirstOrThrow({
			where: {
				userId: Number(userId),
			},
		})

		return NextResponse.json(
			{
				success: true,
				data: {
					...summary,
					totalBalance:
						Number(summary.totalIncome) - Number(summary.totalOutcome),
				},
			},
			{
				status: 200,
			}
		)
	} catch (error) {
		return handleError(error)
	}
}
