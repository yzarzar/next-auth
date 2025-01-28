export interface AuthResponse {
    success: number;
    data: {
        access_token: string;
        refresh_token: string;
        expires_in: string;
    };
}