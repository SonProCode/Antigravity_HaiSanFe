'use client';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

export default function TokenSync() {
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.user && (session.user as any).accessToken) {
            localStorage.setItem('accessToken', (session.user as any).accessToken);
        } else if (!session) {
            // Optional: only clear if explicitly logged out or session expired
            // localStorage.removeItem('accessToken');
        }
    }, [session]);

    return null;
}
