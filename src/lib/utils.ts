import { compare, hash } from 'bcryptjs'
import { clsx, type ClassValue } from 'clsx'
import { format, isValid, parse } from 'date-fns'
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

export const formatDate = (
	dateInput: string | Date | null | undefined
): string => {
	if (!dateInput) {
		return ''
	}

	let dateObject: Date

	if (typeof dateInput === 'string') {
		dateObject = new Date(dateInput)
	} else if (dateInput instanceof Date) {
		dateObject = dateInput
	} else {
		return ''
	}

	if (!isValid(dateObject)) {
		console.error('Invalid date input:', dateInput)
		return ''
	}

	return format(dateObject, 'dd-MM-yyyy')
}

export const parseDate = (
	dateInput: string | Date | null | undefined
): Date | null => {
	if (!dateInput) {
		return null
	}

	if (dateInput instanceof Date && isValid(dateInput)) {
		return dateInput
	}

	if (typeof dateInput !== 'string') {
		console.error(
			'Invalid input type. Expected string or Date, but got:',
			dateInput
		)
		return null
	}

	try {
		const parsed = parse(dateInput, 'dd-MM-yyyy', new Date())
		if (!isValid(parsed)) {
			console.error('Parsing failed for string:', dateInput)
			return null
		}
		return parsed
	} catch (error) {
		console.error('An unexpected error occurred during parsing:', error)
		return null
	}
}

export const formatRupiah = (amount: number): string => {
	return 'Rp' + amount.toLocaleString('id-ID')
}
