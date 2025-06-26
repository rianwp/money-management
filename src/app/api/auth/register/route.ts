import prisma from '@/lib/db'
import { handleError } from '@/lib/error'
import { hashPassword } from '@/lib/utils'
import { validateZod } from '@/lib/validation'
import { IApiResponse } from '@/types/api'
import { registerSchema } from '@/types/Auth/api'
import { Prisma } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export const POST = async (
	req: NextRequest
): Promise<NextResponse<IApiResponse>> => {
	try {
		const body = await req.json()
		const { email, name, password, phone } = validateZod(registerSchema, body)

		const hashedPassword = await hashPassword(password)

		const user = await prisma.user.create({
			data: { email, name, password: hashedPassword, phone: phone || '' },
			omit: {
				password: true,
			},
		})

		return NextResponse.json(
			{
				success: true,
				data: user,
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
							code: 'EMAIL_USED',
							message: 'Email already used',
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
