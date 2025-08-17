'use client'

import { getQueryClient } from '@/lib/fetch'
import { QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { Suspense } from 'react'

interface IProvidersProps {
	children: React.ReactNode
}

const Providers = ({ children }: IProvidersProps) => {
	const queryClient = getQueryClient()
	return (
		<SessionProvider>
			<Suspense>
				<QueryClientProvider client={queryClient}>
					{children}
				</QueryClientProvider>
			</Suspense>
		</SessionProvider>
	)
}

export default Providers
