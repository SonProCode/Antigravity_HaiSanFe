'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
    LayoutDashboard,
    Package,
    ShoppingBag,
    Users,
    BarChart2,
    LogOut,
    Menu,
    X,
    ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
    { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/products', icon: Package, label: 'Sản phẩm' },
    { href: '/admin/orders', icon: ShoppingBag, label: 'Đơn hàng' },
    { href: '/admin/users', icon: Users, label: 'Người dùng' },
    { href: '/admin/analytics', icon: BarChart2, label: 'Phân tích' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session } = useSession();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar */}
            <aside className={cn(
                'fixed inset-y-0 left-0 z-50 w-64 bg-ocean-950 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0',
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            )}>
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-ocean-800">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-ocean-500 flex items-center justify-center">
                            <span className="text-white font-bold text-xs">HS</span>
                        </div>
                        <span className="text-white font-bold text-sm">Admin Panel</span>
                    </Link>
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-ocean-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* User info */}
                <div className="p-4 border-b border-ocean-800">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-ocean-700 flex items-center justify-center text-white font-bold text-sm">
                            {session?.user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <p className="text-white text-sm font-medium truncate">{session?.user?.name}</p>
                            <p className="text-ocean-400 text-xs">Quản trị viên</p>
                        </div>
                    </div>
                </div>

                {/* Nav */}
                <nav className="flex-1 p-3 space-y-1">
                    {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
                        const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
                        return (
                            <Link
                                key={href}
                                href={href}
                                onClick={() => setSidebarOpen(false)}
                                className={cn(
                                    'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors',
                                    isActive
                                        ? 'bg-ocean-600 text-white'
                                        : 'text-ocean-300 hover:bg-ocean-800 hover:text-white'
                                )}
                            >
                                <Icon className="w-5 h-5 shrink-0" />
                                <span className="text-sm font-medium">{label}</span>
                                {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer */}
                <div className="p-3 border-t border-ocean-800">
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-ocean-400 hover:bg-ocean-800 hover:text-white transition-colors text-sm mb-1"
                    >
                        ← Về trang chủ
                    </Link>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors text-sm w-full"
                    >
                        <LogOut className="w-4 h-4" />
                        Đăng xuất
                    </button>
                </div>
            </aside>

            {/* Sidebar overlay for mobile */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top bar */}
                <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 flex items-center gap-4 sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                        <h1 className="font-semibold text-slate-800 text-sm sm:text-base">
                            {NAV_ITEMS.find((n) => n.href === pathname || (n.href !== '/admin' && pathname.startsWith(n.href)))?.label || 'Dashboard'}
                        </h1>
                    </div>
                    <span className="text-xs text-slate-500 hidden sm:block">
                        {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                </header>

                {/* Page content */}
                <main className="flex-1 p-4 sm:p-6 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
