import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

// Extender los tipos de NextAuth
declare module "next-auth" {
    interface Session {
        user: {
            id: string
            name?: string | null
            email?: string | null
            image?: string | null
        }
    }
    interface User {
        id: string
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string
    }
}

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (credentials?.email === "user@example.com" && credentials?.password === "password") {
                    return { id: "1", name: "User", email: "user@example.com" }
                }
                return null
            },
        }),
    ],
    pages: {
        signIn: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id
            }
            return session
        },
    },
}

