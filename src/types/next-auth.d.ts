// import "next-auth";
// import { JWT } from "next-auth/jwt";

// declare module "next-auth" {
//     interface User {
//         id: string;
//         email: string;
//         accessToken: string;
//         refreshToken: string;
//         expiresAt: number;
//     }

//     interface Session {
//         accessToken: string;
//         refreshToken: string;
//         expiresAt: string;
//         user: {
//             email: string;
//         };
//         error?: string;
//         success: number;
//         code: number;
//         message: string;
//         duration: number;
//     }
// }

// declare module "next-auth/jwt" {
//     interface JWT {
//         accessToken: string;
//         refreshToken: string;
//         expiresAt: number;
//         email: string;
//         error?: "RefreshAccessTokenError";
//     }
// } 

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
