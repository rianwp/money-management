'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

interface IProvidersProps {
	children: React.ReactNode
}

const queryClient = new QueryClient()

const Providers = ({ children }: IProvidersProps) => {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	)
}

export default Providers
