import { HTMLInputTypeAttribute } from 'react'

export interface IInputField {
	name: string
	label: string
	placeholder: string
	type?: HTMLInputTypeAttribute
}
