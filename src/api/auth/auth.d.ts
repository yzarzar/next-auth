interface LoginInput {
	identifier?: string
	password?: string
}

interface LoginResponse {
	access_token: string
	refresh_token: string
	expires_in: string
}

interface RefreshToken {
	refresh_token: string
}

interface RefreshTokenResponse {
	access_token: string
	expires_in: string
}