import { AuthOptions, User } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import auth from '@/api/auth/api'
import jwtDecode from 'jsonwebtoken'
import NextAuth from 'next-auth/next'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Identifier' },
        password: { label: 'Password' },
      },
      async authorize(credentials) {
        try {
          const res = await auth.login({
            identifier: credentials?.identifier,
            password: credentials?.password,
          })
          const userData = res.data.data as LoginResponse

          if (res.data.success === 1) {
            const decoded = jwtDecode.decode(
              userData.access_token
            ) as jwtDecode.JwtPayload

            const user: User = {
              id: decoded.id,
              name: decoded.name,
              email: decoded.email,
              accessToken: userData.access_token,
              refreshToken: userData.refresh_token,
              accessTokenExpires: decoded.exp,
              expires_in: userData.expires_in,
            }

            return user
          }
        } catch (error) {
          console.log('Authorization Error:', error)
        }
        return null
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, session, trigger }) {
      if (user && user.expires_in) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }

      if (trigger === 'update') {
        return { ...token, ...session.user }
      }

      return { ...user, ...token }
    },
    async session({ session, token }) {
      if (token) {
        session.user = token
      }
      return session
    },
  },
  pages: {
    signIn: '/',
    signOut: '/',
    error: '/',
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST };