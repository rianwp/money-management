'use client'

import { queryClient } from '@/lib/fetch'
import { QueryClientProvider } from '@tanstack/react-query'

interface IProvidersProps {
	children: React.ReactNode
}

const Providers = ({ children }: IProvidersProps) => {
	return (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	)
}

export default Providers
