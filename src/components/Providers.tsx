'use client'

import { queryClient } from '@/lib/fetch'
import { QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'

interface IProvidersProps {
	children: React.ReactNode
}

const Providers = ({ children }: IProvidersProps) => {
	return (
		<SessionProvider>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</SessionProvider>
	)
}

export default Providers
