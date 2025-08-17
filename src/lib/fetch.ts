import { IApiResponse } from '@/types/api'
import { isServer, QueryClient } from '@tanstack/react-query'
import axios, { AxiosError } from 'axios'

export const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5,
		},
	},
})

const makeQueryClient = () => {
	return queryClient
}

let browserQueryClient: QueryClient | undefined = undefined

export const getQueryClient = () => {
	if (isServer) {
		return makeQueryClient()
	} else {
		if (!browserQueryClient) browserQueryClient = makeQueryClient()
		return browserQueryClient
	}
}

export const axiosInstance = axios.create({
	baseURL: '/api',
})

export const handleAxiosError = (error: AxiosError<IApiResponse>) => {
	if (axios.isAxiosError(error)) {
		return error.response?.data
	}

	return null
}
