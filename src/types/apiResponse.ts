export interface IApiResponse<T = object> {
	success: boolean
	data?: T
	error?: {
		code: string
		message: string
	}
}
