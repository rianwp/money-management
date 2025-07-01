import { compare, hash } from 'bcryptjs'
import { clsx, type ClassValue } from 'clsx'
import { format } from 'date-fns'
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

export const formatDate = (rawDate: Date): string => {
	return format(rawDate, 'dd-MM-yyyy')
}

export const formatRupiah = (amount: number): string => {
	return 'Rp' + amount.toLocaleString('id-ID')
}
