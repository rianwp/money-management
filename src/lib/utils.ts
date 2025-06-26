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

export const formatDate = (date: Date): string => {
	const day = date.getDate().toString().padStart(2, '0')
	const month = (date.getMonth() + 1).toString().padStart(2, '0') // +1 because months are 0-indexed
	const year = date.getFullYear()

	return `${day}-${month}-${year}`
}

export const formatRupiah = (amount: number): string => {
	return 'Rp' + amount.toLocaleString('id-ID')
}
