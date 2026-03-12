import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { authConfig } from './auth.config';
import fs from 'fs';
import path from 'path';

function getUsers() {
    try {
        const dbPath = path.join(process.cwd(), 'data', 'db.json');
        const raw = fs.readFileSync(dbPath, 'utf-8');
        const db = JSON.parse(raw);
        return db.users || [];
    } catch {
        return [];
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        Credentials({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Mật khẩu', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
                const apiUrl = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/$/, '')}/api`;

                try {
                    const res = await fetch(`${apiUrl}/auth/login`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    if (!res.ok) return null;
                    const data = await res.json();

                    return {
                        id: data.user.id,
                        name: data.user.name,
                        email: data.user.email,
                        image: data.user.image,
                        role: (data.user.role as string).toLowerCase(),
                        accessToken: data.accessToken,
                    };
                } catch (error) {
                    console.error('Auth authorize error:', error);
                    return null;
                }
            },
        }),
    ],
});

