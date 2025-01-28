import { authOptions } from '@/config/AuthOptions'
import useAxiosHandler from '@/hooks/useAxiosHandler'
import axios from 'axios'

const instance = axios.create({
	baseURL: process.env.BASE_URL + '/api',
})

export const noAuthAxios = axios.create({
	baseURL: process.env.BASE_URL + '/api',
})

noAuthAxios.interceptors.response.use(
	(response) => response,
	(error) => Promise.reject(useAxiosHandler(error))
)

instance.interceptors.request.use(
	async (config) => {
		// Client-side header handling
		config.headers['Content-Type'] = 'application/json'
		return config
	},
	(error) => Promise.reject(useAxiosHandler(error))
)

instance.interceptors.response.use(
	(response) => response,
	(error) => Promise.reject(useAxiosHandler(error))
)

export default instance
