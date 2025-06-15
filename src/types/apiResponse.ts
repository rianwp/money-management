export interface IApiResponse<T> {
	success: boolean
	data?: T
	error?: {
		code: string
		message: string
		details?: unknown
	}
}
