// import { withAuth } from "next-auth/middleware";
// import { NextResponse } from "next/server";
// import axios from "axios";
// import { JWT } from "next-auth/jwt";

// async function refreshToken(token: JWT): Promise<JWT> {
//     try {
//         const response = await axios.post(
//             "https://user-api-staging.aceplusbeta.com/api/auth/refresh",
//             {
//                 refresh_token: token.refreshToken,
//             },
//             {
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Accept': 'application/json'
//                 }
//             }
//         );

//         if (response.data.success === 1) {
//             // Parse the exact date-time from API without modification
//             const expiresInStr = response.data.data.expires_in;
//             const expiresAt = new Date(expiresInStr.replace(' ', 'T') + '+0630').getTime();
//             console.log('New token expiry:', new Date(expiresAt).toLocaleString('en-US', { timeZone: 'Asia/Yangon' }));
//             return {
//                 ...token,
//                 accessToken: response.data.data.access_token,
//                 refreshToken: token.refreshToken,
//                 expiresAt,
//                 error: undefined
//             };
//         }

//         throw new Error("RefreshAccessTokenError");
//     } catch (error) {
//         console.error("Refresh token error:", error);
//         return {
//             ...token,
//             error: "RefreshAccessTokenError"
//         };
//     }
// }

// export default withAuth(
//     async function middleware(req) {
//         const token = req.nextauth.token;

//         if (token) {
//             const now = Date.now();
//             if (now >= token.expiresAt) {
//                 // Token has expired, try to refresh it
//                 console.log("Token expired, refreshing...", new Date(token.expiresAt).toLocaleString('en-US', { timeZone: 'Asia/Yangon' }));
//                 const newToken = await refreshToken(token);
//                 if (newToken.error) {
//                     // Refresh failed, redirect to login
//                     console.log("Refresh failed, redirecting to login");
//                     return NextResponse.redirect(new URL('/login', req.url));
//                 }
//                 // Update the token in the request
//                 req.nextauth.token = newToken;
//                 console.log("Token refreshed successfully");
//             }
//         }

//         return NextResponse.next();
//     },
//     {
//         callbacks: {
//             authorized: ({ token }) => !!token
//         },
//         pages: {
//             signIn: "/login"
//         }
//     }
// );

// export const config = {
//     matcher: [
//         // Protected routes
//         "/",
//         "/dashboard/:path*",

//         '/((?!api|_next|static|public|favicon.ico|register|reset-password|forgot-password).*)',
//     ]
// }; 

import { NextResponse, type NextRequest } from 'next/server'
import { encode, getToken, type JWT } from 'next-auth/jwt'
import jwtDecode from 'jsonwebtoken'
import { withAuth } from 'next-auth/middleware'
import authRoutes from './api/auth/routes'

const TOKEN_REFRESH_BUFFER_SECONDS = 5 // 5 seconds
// const SESSION_TIMEOUT = 3600 * 2 // 2 hour
const SESSION_SECURE = process.env.NEXTAUTH_URL?.startsWith('https://')
const DOMAIN =
    process.env.NODE_ENV != 'production'
        ? '.aceplus.com'
        : '.' + process.env.APP_DOMAIN

export const SESSION_COOKIE = SESSION_SECURE
    ? '__Secure-next-auth.session-token'
    : 'next-auth.session-token'

export const config = {
    matcher: [
        "/",
        "/dashboard/:path*",
        "/((?!api|_next|static|public|favicon.ico|login).*)",
    ],
}

export default withAuth(
    function middleware(req) {
        return checkrefresh(req)
    },
    {
        callbacks: {
            authorized: ({ token, req: { headers } }) => {
                //app navigation is handled by false callback
                //api is handled in middleware
                if (!token) {
                    const isServerAction = headers.get('Next-Action')
                        ? true
                        : false
                    return isServerAction ? true : false
                }
                return true
            },
        },
        pages: {
            signIn: '/',
            signOut: '/',
        },
    }
)

export function shouldUpdateToken(token: JWT): boolean {
    if (!token) {
        console.log('no token................')
        return false
    }
    return (
        Math.floor(Date.now() / 1000) + TOKEN_REFRESH_BUFFER_SECONDS >
        (token.accessTokenExpires as number)
    )
}

export async function refreshAccessToken(token: JWT): Promise<JWT | null> {
    try {
        const response = await fetch(
            process.env.BASE_URL + '/api' + authRoutes.refresh_token,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refresh_token: token.refreshToken,
                }),
            }
        )

        if (response.ok) {
            const result = await response.json()
            const newAccessToken = result.data.access_token
            const decoded = jwtDecode.decode(
                result.data.access_token
            ) as jwtDecode.JwtPayload
            return {
                ...token,
                accessToken: newAccessToken,
                accessTokenExpires: decoded.exp!,
                refreshToken: token.refreshToken,
                expires_in: result.data.expires_in,
            }
        } else {
            return null
        }
    } catch (e) {
        console.error(e, 'ERROR')
        return null
    }
}

export const signOut = (request: NextRequest) => {
    const response = NextResponse.redirect(new URL('/', request.url))
    request.cookies.getAll().forEach((cookie) => {
        if (cookie.name.startsWith(SESSION_COOKIE)) {
            console.log('deleting cookies....................', cookie.name)
            response.cookies.set(cookie.name, '', {
                httpOnly: true,
                secure: SESSION_SECURE,
                sameSite: 'lax',
                path: '/',
                maxAge: 0,
                expires: new Date(0),
                domain: DOMAIN,
            })
        }
    })

    return response
}

export function updateCookie(
    sessionToken: string | null,
    request: NextRequest,
    response: NextResponse
): NextResponse<unknown> {
    const size = 3958
    const regex = new RegExp('.{1,' + size + '}', 'g')

    if (sessionToken) {
        const tokenChunks = sessionToken.match(regex)

        if (tokenChunks && tokenChunks.length > 2) {
            tokenChunks.forEach((tokenChunk, index) => {
                request.cookies.set(`${SESSION_COOKIE}.${index}`, tokenChunk)
            })

            response = NextResponse.next({
                request: {
                    headers: request.headers,
                },
            })

            tokenChunks.forEach((tokenChunk, index) => {
                console.log(
                    'setting new token Chumks ...........................'
                )
                response.cookies.set(`${SESSION_COOKIE}.${index}`, tokenChunk, {
                    httpOnly: true,
                    secure: SESSION_SECURE,
                    sameSite: 'lax',
                    path: '/',
                    domain: DOMAIN,
                })
            })
        } else {
            request.cookies.set(SESSION_COOKIE, sessionToken)

            response = NextResponse.next({
                request: {
                    headers: request.headers,
                },
            })

            console.log('Setting new token............')
            response.cookies.set(SESSION_COOKIE, sessionToken, {
                httpOnly: true,
                secure: SESSION_SECURE,
                sameSite: 'lax',
                path: '/',
                domain: DOMAIN,
            })
        }
    } else {
        console.log('no session cookie signout............')
        return signOut(request)
    }

    return response
}

export const checkrefresh = async (request: NextRequest) => {
    let response = NextResponse.next()
    // if (request.headers.get('Next-Action')) {
    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET,
        cookieName: SESSION_COOKIE,
    })

    try {
        if (token) {
            if (shouldUpdateToken(token)) {
                console.log('token should update......')
                const newToken = await refreshAccessToken(token!)
                if (newToken) {
                    const newSessionToken = await encode({
                        secret: process.env.NEXTAUTH_SECRET!,
                        token: newToken,
                        maxAge: 3600,
                    })
                    console.log(newToken)
                    response = updateCookie(newSessionToken, request, response)
                } else {
                    console.log('no token signout..........')
                    return signOut(request)
                }
            }
        }
    } catch (error) {
        console.log('catch signout....................')
        return signOut(request)
    }
    // }

    return response
}
