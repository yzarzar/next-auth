import axios, { noAuthAxios } from '../'
import routes from './routes'

const API = {
	login: (data: LoginInput) =>
		noAuthAxios.post<HTTPResponse<LoginResponse>>(routes.login, data),

	logout: () =>
		axios.post<HTTPResponse<null>>(routes.logout).then((res) => res.data),

	refreshToken: (data: RefreshToken) =>
		axios.post<HTTPResponse<RefreshTokenResponse>>(
			routes.refresh_token,
			data
		),
}

export default API
