// eslint-disable-next-line @typescript-eslint/no-unused-vars
import NextAuth, { type DefaultSession } from 'next-auth'

// Extend the User interface
declare module 'next-auth' {
    interface User {
        id: number
        email: string
        accessToken: string
        refreshToken: string
        expires_in: string
        accessTokenExpires: number | undefined
    }

    interface Session {
        user: User
        token: Token
    }

    interface Token {
        token: string
        auth_id: string
    }
}

// Extend the JWT interface to include all properties from the User interface
declare module 'next-auth/jwt' {
    interface JWT {
        id: number
        name: string
        email: string
        accessToken: string
        refreshToken: string
        expires_in: string
        accessTokenExpires: number | undefined
    }
}
