import { HTMLInputTypeAttribute } from 'react'

export interface IInputField {
	name: string
	label: string
	placeholder: string
	type?: HTMLInputTypeAttribute
}

export interface IFilterField extends IInputField {
	fieldType: 'date' | 'select' | 'text' | 'number' | 'date-range' | 'sort-select' | 'type-select'
	options?: { label: string; value: string }[]
	placeholderEnd?: string // For date range fields
}
