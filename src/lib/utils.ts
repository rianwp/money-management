import { compare, hash } from 'bcryptjs'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs))
}

export const hashPassword = async (plainPassword: string) => {
	const saltRounds = 12
	return await hash(plainPassword, saltRounds)
}

export const verifyPassword = async (
	plainPassword: string,
	hashedPassword: string
) => {
	return await compare(plainPassword, hashedPassword)
}
