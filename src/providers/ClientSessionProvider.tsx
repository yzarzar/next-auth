'use client'

import { SessionProvider } from 'next-auth/react'

export default function Provider({
	children,
	refetchInterval,
}: {
	children: React.ReactNode
	refetchInterval?: number
}): React.ReactNode {
	return (
		<SessionProvider refetchInterval={refetchInterval}>
			{children}
		</SessionProvider>
	)
}
