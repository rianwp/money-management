import {
	IRegisterRequest,
	ILoginRequest,
	loginSchema,
	registerSchema,
} from './api'
import { IInputField } from '../form'

export interface IAuthFormComponentData {
	submitCta: string
	inputField: IInputField[]
	submitFn: (values: ILoginRequest | IRegisterRequest) => Promise<unknown>
	redirectCta: {
		ctaText: string
		href: string
		name: string
	}
	formSchema: typeof loginSchema | typeof registerSchema
}
