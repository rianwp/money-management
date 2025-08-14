import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { handleError } from '@/lib/error'
import { validateZod } from '@/lib/validation'
import { IApiResponse } from '@/types/api'
import { transactionQuerySchema } from '@/types/transaction/api'
import { NextRequest, NextResponse } from 'next/server'
import { User as UserAuth } from 'next-auth'
import * as XLSX from 'xlsx'
import { formatDate } from '@/lib/utils'

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
			startDate: searchParams.get('startDate'),
			endDate: searchParams.get('endDate'),
			categoryId: searchParams.get('categoryId'),
		})

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
				category: {
					select: {
						name: true,
					},
				},
			},
			orderBy: {
				date: query.sort || 'desc',
			},
			omit: {
				id: true,
				categoryId: true,
				userId: true,
			},
		})

		const mappedTransaction = transaction.map((item, index) => ({
			No: index + 1,
			'Transaction Name': item.title,
			'Amount (in Rupiah)': Number(item.amount),
			Description: item.description,
			'Transaction Date': item.date,
			Type: item.type,
			Category: item?.category?.name,
			'Created At': item.createdAt,
			'Updated At': item.updatedAt,
		}))

		const wb = XLSX.utils.book_new()

		const ws = XLSX.utils.json_to_sheet(mappedTransaction)

		ws['!cols'] = [
			{ width: 5 }, // No
			{ width: 25 }, // Transaction Name
			{ width: 20 }, // Amount
			{ width: 30 }, // Description
			{ width: 15 }, // Transaction Date
			{ width: 10 }, // Type
			{ width: 15 }, // Category
			{ width: 20 }, // Created At
			{ width: 20 }, // Updated At
		]

		XLSX.utils.book_append_sheet(wb, ws, 'Transactions')

		const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })

		const filename = `transactions_export_${formatDate(new Date())}.xlsx`

		return new NextResponse(buffer, {
			status: 200,
			headers: {
				'Content-Type':
					'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'Content-Disposition': `attachment; filename=${filename}`,
			},
		})
	} catch (error) {
		return handleError(error)
	}
}
