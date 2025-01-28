import { AxiosError } from 'axios'
import { redirect } from 'next/navigation'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useAxiosHandler = async (e: any) => {
	if (e instanceof AxiosError) {
		console.log(e?.response)
		return e?.response?.data
	} else {
		if ((e.message = 'NEXT_REDIRECT')) {
			redirect('/')
		}
		console.log('Axios Response:', e)
	}

	return e
}

export default useAxiosHandler
