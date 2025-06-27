'use client'

import { queryClient } from '@/lib/fetch'
import {
	isServer,
	QueryClient,
	QueryClientProvider,
} from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'

const makeQueryClient = () => {
	return queryClient
}

let browserQueryClient: QueryClient | undefined = undefined

const getQueryClient = () => {
	if (isServer) {
		return makeQueryClient()
	} else {
		if (!browserQueryClient) browserQueryClient = makeQueryClient()
		return browserQueryClient
	}
}

interface IProvidersProps {
	children: React.ReactNode
}

const Providers = ({ children }: IProvidersProps) => {
	const queryClient = getQueryClient()
	return (
		<SessionProvider>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</SessionProvider>
	)
}

export default Providers
