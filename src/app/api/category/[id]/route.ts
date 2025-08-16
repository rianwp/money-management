import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/db'
import { handleError } from '@/lib/error'
import { validateZod } from '@/lib/validation'
import { IApiParams, IApiResponse } from '@/types/api'
import { categoryUpdateSchema } from '@/types/category/api'
import { User as UserAuth } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export const DELETE = async (
	req: NextRequest,
	{ params }: IApiParams<{ id: string }>
): Promise<NextResponse<IApiResponse>> => {
	try {
		const { id: userId } = (await getCurrentUser()) as UserAuth

		const { id } = await params

		await prisma.category.update({
			where: {
				userId: Number(userId),
				id: Number(id),
			},
			data: {
				isActive: false,
			},
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

export const PUT = async (
	req: NextRequest,
	{ params }: IApiParams<{ id: string }>
): Promise<NextResponse<IApiResponse>> => {
	try {
		const { id: userId } = (await getCurrentUser()) as UserAuth

		const { id } = await params
		const body = await req.json()
		const { description, icon, monthlyTarget, name, type, target } =
			validateZod(categoryUpdateSchema, body)

		const category = await prisma.category.update({
			where: {
				userId: Number(userId),
				id: Number(id),
			},
			data: {
				description,
				icon,
				monthlyTarget,
				target,
				name,
				type,
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
