import { HTMLInputTypeAttribute } from 'react'
import {
	IRegisterRequest,
	ILoginRequest,
	loginSchema,
	registerSchema,
} from './api'

interface IInputField {
	name: string
	label: string
	placeholder: string
	type?: HTMLInputTypeAttribute
}

export interface IAuthFormComponentData {
	submitCta: string
	inputField: IInputField[]
	submitFn: (values: ILoginRequest | IRegisterRequest) => void
	redirectCta: {
		ctaText: string
		href: string
		name: string
	}
	formSchema: typeof loginSchema | typeof registerSchema
}
