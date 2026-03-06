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

                const users = getUsers();
                const user = users.find((u: { email: string; password: string; isActive: boolean }) => u.email === credentials.email);

                if (!user) return null;
                if (user.password !== credentials.password) return null;
                if (!user.isActive) return null;

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    image: user.image,
                    role: user.role,
                };
            },
        }),
    ],
});

