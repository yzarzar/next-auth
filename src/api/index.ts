import { authOptions } from '@/config/AuthOptions'
import useAxiosHandler from '@/hooks/useAxiosHandler'
import axios from 'axios'
import { headers } from 'next/headers'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

const instance = axios.create({
	baseURL: process.env.BASE_URL + '/api',
})

export const noAuthAxios = axios.create({
	baseURL: process.env.BASE_URL + '/api',
})

noAuthAxios.interceptors.response.use(
	(response) => {
		return response
	},
	(error) => {
		return Promise.reject(useAxiosHandler(error))
	}
)

instance.interceptors.request.use(
	async (config) => {
		const session = await getServerSession(authOptions)

		const headersList = await headers()

		const host = headersList.get('host')

		const protocol = headersList.get('x-forwarded-proto')

		const origin = `${protocol}://${host}`

		if (session) {
			config.headers['Origin'] = origin
		} else {
			redirect('/')
		}
		console.log(config)

		return config
	},
	(error) => {
		return Promise.reject(useAxiosHandler(error))
	}
)

instance.interceptors.response.use(
	(response) => {
		return response
	},
	(error) => {
		return Promise.reject(useAxiosHandler(error))
	}
)

export default instance
