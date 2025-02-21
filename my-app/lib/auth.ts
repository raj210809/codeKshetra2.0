import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { getCsrfToken } from "next-auth/react"
import { SiweMessage } from "siwe"
import jwt from 'jsonwebtoken'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0",
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0",
        },
      },
      async authorize(credentials, req) {
        try {
          const siwe = new SiweMessage(JSON.parse(credentials?.message || "{}"))
          const nextAuthUrl = new URL( 'http://localhost:3000' )          
          const result = await siwe.verify({
            signature: credentials?.signature || "",
            domain: nextAuthUrl.host,
            nonce: await getCsrfToken({ req: { headers: req.headers } }),
          })

          console.log("result", result)
          
          if (result.success) {
            return {
              id: siwe.address,
            }
          }
          return null
        } catch (e) {
          console.error("Authorization error:", e)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  secret: '7LHhPsrFAH/qEO8H6qpSVsMLLuYQGlMI/SvJSoT1YLGvS6uBHsec4EjG3f99efVSrT11Na3IdY0ULRDAhGug3A==',
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }

      // Generate Supabase JWT
      const supabaseJwtPayload = {
        aud: 'authenticated',
        exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour from now
        sub: token.sub,
        email: token.email,
        role: 'authenticated',
      }

      const supabaseToken = jwt.sign(
        supabaseJwtPayload,
        '7LHhPsrFAH/qEO8H6qpSVsMLLuYQGlMI/SvJSoT1YLGvS6uBHsec4EjG3f99efVSrT11Na3IdY0ULRDAhGug3A=='
      )

      token.supabaseAccessToken = supabaseToken

      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          name: token.sub ?? session?.user?.name,
          address: token.sub as string | undefined,
        },
        supabaseAccessToken: token.supabaseAccessToken,
      }
    },
  }
}