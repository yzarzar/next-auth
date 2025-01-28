'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import { useCallback } from 'react'

type SearchFilter = {
	search?: string
}

const useSearch = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const pathname = usePathname()

	const search = searchParams.get('search') || undefined
	const page = Number(searchParams.get('page')) || 1

	const setSearch = useCallback(
		(filters: SearchFilter) => {
			const params = new URLSearchParams(searchParams.toString())

			if (filters.search !== undefined && filters.search !== '') {
				params.set('search', filters.search)
			} else {
				params.delete('search')
			}

			router.push(`${pathname}?${params.toString()}`)
		},
		[router, searchParams, pathname]
	)

	return { search, page, setSearch }
}

export default useSearch
