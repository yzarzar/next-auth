'use client'
import { AxiosError } from 'axios'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useHandleError = (onError: any) => {
	const router = useRouter()

	return async (err: AxiosError) => {
		const status = err?.response?.status
		if (status === 403) {
			await signOut()
			return
		}

		if (status === 500) {
			router.push(`/error?status=${status}`)
			return
		}

		const shouldContinue = onError?.(err)

		if (!shouldContinue) return

		console.error('useHandleError', err)
		router.push(`/error?status=${status}`)
	}
}

export { useHandleError }
