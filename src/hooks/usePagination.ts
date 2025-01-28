'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { useCallback } from 'react'

type PageLimitFilters = {
	page?: number
	limit?: number
}

const usePagination = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const pathname = usePathname()

	const page = searchParams.get('page')
		? parseInt(searchParams.get('page') as string)
		: undefined
	const limit = searchParams.get('limit')
		? parseInt(searchParams.get('limit') as string)
		: undefined

	const setPageOrLimit = useCallback(
		(filters: PageLimitFilters) => {
			const params = new URLSearchParams(searchParams.toString())

			if (filters.page !== undefined) {
				params.set('page', filters.page.toString())
			}

			if (filters.limit !== undefined) {
				params.set('limit', filters.limit.toString())
			}

			router.push(`${pathname}?${params.toString()}`)
		},
		[router, searchParams, pathname]
	)

	return { page, limit, setPageOrLimit }
}

export default usePagination
