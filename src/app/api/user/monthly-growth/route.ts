import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { handleError } from '@/lib/error'
import { IApiResponse } from '@/types/api'
import { endOfMonth, startOfMonth, subMonths } from 'date-fns'
import { User as UserAuth } from 'next-auth'
import { NextResponse } from 'next/server'

export const GET = async (): Promise<NextResponse<IApiResponse>> => {
	try {
		const { id: userId } = (await getCurrentUser()) as UserAuth

		const now = new Date()
		const currentMonthStart = startOfMonth(now)
		const currentMonthEnd = endOfMonth(now)
		const prevMonthStart = startOfMonth(subMonths(now, 1))
		const prevMonthEnd = endOfMonth(subMonths(now, 1))

		// Monthly income/expense only
		const getMonthlyTotals = async (start: Date, end: Date) => {
			const result = await prisma.transaction.groupBy({
				by: ['type'],
				where: {
					userId: Number(userId),
					date: { gte: start, lte: end },
				},
				_sum: { amount: true },
			})

			const income =
				result.find((r) => r.type === 'INCOME')?._sum.amount?.toNumber() || 0
			const expense =
				result.find((r) => r.type === 'EXPENSE')?._sum.amount?.toNumber() || 0

			return { income, expense }
		}

		// Cumulative balance (up to specific point)
		const getCumulativeBalance = async (until: Date) => {
			const result = await prisma.transaction.groupBy({
				by: ['type'],
				where: {
					userId: Number(userId),
					date: { lte: until },
				},
				_sum: { amount: true },
			})

			const income =
				result.find((r) => r.type === 'INCOME')?._sum.amount?.toNumber() || 0
			const expense =
				result.find((r) => r.type === 'EXPENSE')?._sum.amount?.toNumber() || 0

			return income - expense
		}

		const calcGrowth = (
			current: number,
			previous: number,
			{ reverse = false, soft = false } = {}
		): { percent: number; label: string; progress: number } => {
			let percent: number

			if (soft && current === 0 && previous !== 0) {
				percent = 0
			} else if (previous === 0) {
				percent = current === 0 ? 0 : 100
			} else {
				const raw = ((current - previous) / previous) * 100
				percent = reverse ? -raw : raw
			}

			return {
				percent,
				label: `${percent > 0 ? '+' : ''}${percent.toFixed(1)}%`,
				progress: Math.abs(percent),
			}
		}

		const current = await getMonthlyTotals(currentMonthStart, currentMonthEnd)
		const previous = await getMonthlyTotals(prevMonthStart, prevMonthEnd)

		const currentBalance = await getCumulativeBalance(currentMonthEnd)
		const previousBalance = await getCumulativeBalance(prevMonthEnd)

		return NextResponse.json(
			{
				success: true,
				data: {
					incomeGrowth: calcGrowth(current.income, previous.income, {
						soft: true,
					}),
					expenseGrowth: calcGrowth(current.expense, previous.expense, {
						reverse: true,
						soft: true,
					}),
					balanceGrowth: calcGrowth(currentBalance, previousBalance, {
						soft: true,
					}),
				},
			},
			{ status: 200 }
		)
	} catch (error) {
		return handleError(error)
	}
}
