'use client'

import {
	redirect,
	usePathname,
	useRouter,
	useSearchParams,
} from 'next/navigation'
import { useCallback } from 'react'

type Filter = {
	sortBy?: string
	sortOrder?: boolean
}

const useSorting = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const pathname = usePathname()

	const sortBy = searchParams.get('sort_by')
		? (searchParams.get('sort_by') as string)
		: undefined
	const sortOrder = searchParams.get('sort_order')
		? (searchParams.get('sort_order') as string)
		: undefined

	const setFilter = useCallback(
		(filters: Filter) => {
			const params = new URLSearchParams(searchParams.toString())

			if (filters.sortBy !== undefined) {
				params.set('sort_by', filters.sortBy.toLowerCase())
			}

			if (filters.sortOrder !== undefined) {
				params.set('sort_order', filters.sortOrder ? 'desc' : 'asc')
			}

			router.push(`${pathname}?${params.toString()}`)
			redirect(pathname)
		},
		[router, searchParams, pathname]
	)

	return { sortBy, sortOrder, setFilter }
}

export default useSorting
