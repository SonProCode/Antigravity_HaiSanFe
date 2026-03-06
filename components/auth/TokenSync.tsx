'use client';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function TokenSync() {
    const { data: session } = useSession();

    useEffect(() => {
        // Ensure sessionId exists for guest identification
        if (typeof window !== 'undefined' && !localStorage.getItem('sessionId')) {
            const sid = 'sid_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
            localStorage.setItem('sessionId', sid);
        }

        if (session?.user && (session.user as any).accessToken) {
            localStorage.setItem('accessToken', (session.user as any).accessToken);
        }
    }, [session]);

    return null;
}
