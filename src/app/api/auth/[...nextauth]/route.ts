// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { AuthResponse } from "@/types/auth";
// import axios from "axios";
// import { JWT } from "next-auth/jwt";

// if (!process.env.NEXTAUTH_SECRET) {
//     throw new Error('NEXTAUTH_SECRET is not defined');
// }

// const handler = NextAuth({
//     providers: [
//         CredentialsProvider({
//             name: "Credentials",
//             credentials: {
//                 identifier: { label: "Email", type: "email" },
//                 password: { label: "Password", type: "password" },
//             },
//             async authorize(credentials) {
//                 try {
//                     const response = await axios.post<AuthResponse>(
//                         "https://user-api-staging.aceplusbeta.com/api/auth/login",
//                         {
//                             identifier: credentials?.identifier,
//                             password: credentials?.password,
//                         }
//                     );

//                     if (response.data.success === 1) {
//                         if (!credentials?.identifier) {
//                             return null;
//                         }
//                         // Parse JWT token to get user info
//                         const tokenData = JSON.parse(atob(response.data.data.access_token.split('.')[1]));
                        
//                         // Parse the exact date-time from API without modification
//                         const expiresInStr = response.data.data.expires_in as string;
//                         const expiresAt = new Date(expiresInStr.replace(' ', 'T') + '+0630').getTime();
                        
//                         return {
//                             id: credentials.identifier,
//                             email: tokenData.email,
//                             accessToken: response.data.data.access_token,
//                             refreshToken: response.data.data.refresh_token,
//                             expiresAt
//                         };
//                     }
//                     return null;
//                 } catch (error) {
//                     console.error("Login error:", error);
//                     return null;
//                 }
//             },
//         }),
//     ],
//     callbacks: {
//         async jwt({ token, user }) {
//             if (user) {
//                 return {
//                     accessToken: user.accessToken,
//                     refreshToken: user.refreshToken,
//                     expiresAt: user.expiresAt,
//                     email: user.email,
//                 } as JWT;
//             }
//             return token;
//         },
//         async session({ session, token }) {
//             session.accessToken = token.accessToken;
//             session.refreshToken = token.refreshToken;
            
//             // Convert timestamp back to Myanmar time string format
//             const date = new Date(token.expiresAt);
//             const myanmarOptions: Intl.DateTimeFormatOptions = {
//                 year: 'numeric',
//                 month: '2-digit',
//                 day: '2-digit',
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 second: '2-digit',
//                 hour12: false,
//                 timeZone: 'Asia/Yangon'
//             };
            
//             // Format to match API response format exactly
//             const formattedDate = date.toLocaleString('en-US', myanmarOptions)
//                 .replace(/(\d+)\/(\d+)\/(\d+),\s/, '$3-$1-$2 ');
            
//             session.expiresAt = formattedDate;
//             session.error = token.error;
//             session.user = {
//                 email: token.email,
//             };
            
//             return session;
//         }
//     },
//     pages: {
//         signIn: "/login",
//     },
//     secret: process.env.NEXTAUTH_SECRET,
//     session: {
//         strategy: "jwt",
//     }
// });

// export const GET = handler;
// export const POST = handler;
// export const auth = handler;

import NextAuth from 'next-auth/next'
import { authOptions } from '@/config/AuthOptions'

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
