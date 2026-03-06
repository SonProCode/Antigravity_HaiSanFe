import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
    pages: {
        signIn: '/auth/login',
        error: '/auth/error',
    },
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const role = auth?.user?.role;
            const isAdminPath = nextUrl.pathname.startsWith('/admin');
            const isProtectedPath = nextUrl.pathname.startsWith('/checkout') || nextUrl.pathname.startsWith('/account');

            if (isAdminPath) {
                if (isLoggedIn && role === 'admin') return true;
                return Response.redirect(new URL('/auth/login', nextUrl));
            }

            if (isProtectedPath) {
                if (isLoggedIn) return true;
                return false; // Redirect to signin
            }

            return true;
        },
        async jwt({ token, user, account }) {
            if (user) {
                token.id = user.id;
                token.role = (user as { role?: string }).role || 'user';
            }
            if (account?.provider === 'google') {
                token.role = 'user';
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
    providers: [], // Empty array, we'll add providers in auth.ts
    session: {
        strategy: 'jwt',
    },
    secret: process.env.AUTH_SECRET,
} satisfies NextAuthConfig;
