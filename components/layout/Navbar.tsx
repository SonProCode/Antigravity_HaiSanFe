'use client';
import { useCartStore } from '@/store/cart';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, Search, User, Menu, X, ChevronDown, LayoutDashboard, Package, LogOut, MapPin, BarChart2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Navbar() {
    const { data: session } = useSession();
    const itemCount = useCartStore((s) => s.getItemCount());
    const setCartOpen = useCartStore((s) => s.setOpen);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Close dropdown on click outside
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
            setMobileOpen(false);
        }
    }

    const NAV_LINKS = [
        { href: '/products', label: 'Sản phẩm' },
        { href: '/order/track', label: 'Tra cứu đơn hàng' },
        { href: '/about', label: 'Về chúng tôi' },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-ocean-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ocean-500 to-teal-600 flex items-center justify-center shadow-sm">
                            <span className="text-white font-bold text-sm">HS</span>
                        </div>
                        <div className="hidden sm:block">
                            <div className="font-bold text-ocean-800 text-base leading-tight">Hải Sản</div>
                            <div className="text-ocean-500 text-xs -mt-0.5 font-medium">Quảng Ninh</div>
                        </div>
                    </Link>

                    {/* Search bar - desktop */}
                    <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-6">
                        <div className="relative w-full">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Tìm tôm, cá, mực, cua..."
                                className="w-full pl-4 pr-12 py-2.5 rounded-full border border-ocean-200 bg-ocean-50 focus:bg-white focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100 outline-none text-sm transition-all"
                            />
                            <button
                                type="submit"
                                className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-ocean-500 hover:bg-ocean-600 flex items-center justify-center transition-colors"
                            >
                                <Search className="w-4 h-4 text-white" />
                            </button>
                        </div>
                    </form>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-6">
                        {NAV_LINKS.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-slate-600 hover:text-ocean-600 text-sm font-medium transition-colors whitespace-nowrap"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Right actions */}
                    <div className="flex items-center gap-2 ml-4">
                        {/* Cart */}
                        <button
                            onClick={() => setCartOpen(true)}
                            className="relative p-2 rounded-full hover:bg-ocean-50 transition-colors"
                            aria-label="Giỏ hàng"
                        >
                            <ShoppingCart className="w-5 h-5 text-slate-600" />
                            {itemCount > 0 && (
                                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                    {itemCount > 9 ? '9+' : itemCount}
                                </span>
                            )}
                        </button>

                        {/* Auth */}
                        {session?.user ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(!dropdownOpen)}
                                    className="flex items-center gap-2 p-1.5 rounded-full hover:bg-ocean-50 transition-colors"
                                >
                                    <div className="w-7 h-7 rounded-full overflow-hidden bg-ocean-100">
                                        {session.user.image ? (
                                            <Image src={session.user.image} alt={session.user.name || ''} width={28} height={28} className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-ocean-600 font-semibold text-xs">
                                                {session.user.name?.[0]?.toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <ChevronDown className={cn('w-3 h-3 text-slate-500 transition-transform hidden sm:block', dropdownOpen && 'rotate-180')} />
                                </button>

                                {dropdownOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-ocean-100 py-1 animate-fade-in-up">
                                        <div className="px-4 py-2 border-b border-ocean-50">
                                            <p className="text-sm font-semibold text-slate-800 truncate">{session.user.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{session.user.email}</p>
                                        </div>

                                        {session.user.role === 'admin' && (
                                            <Link
                                                href="/admin"
                                                className="flex items-center gap-2 px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 transition-colors"
                                                onClick={() => setDropdownOpen(false)}
                                            >
                                                <LayoutDashboard className="w-4 h-4" />
                                                Dashboard
                                            </Link>
                                        )}

                                        <Link
                                            href="/account"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-ocean-50 transition-colors"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <User className="w-4 h-4" />
                                            Thông tin cá nhân
                                        </Link>

                                        <Link
                                            href="/account/orders"
                                            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-ocean-50 transition-colors"
                                            onClick={() => setDropdownOpen(false)}
                                        >
                                            <Package className="w-4 h-4" />
                                            Đơn hàng của tôi
                                        </Link>

                                        <button
                                            onClick={() => { setDropdownOpen(false); signOut({ callbackUrl: '/' }); }}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            Đăng xuất
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="hidden sm:flex items-center gap-2">
                                <Link
                                    href="/auth/login"
                                    className="px-4 py-2 text-sm font-medium text-ocean-600 hover:text-ocean-700 transition-colors"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="px-4 py-2 text-sm font-semibold text-white bg-ocean-500 hover:bg-ocean-600 rounded-full transition-colors shadow-sm"
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="lg:hidden p-2 rounded-full hover:bg-ocean-50 transition-colors"
                            aria-label="Menu"
                        >
                            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileOpen && (
                <div className="lg:hidden border-t border-ocean-100 bg-white animate-fade-in-up">
                    <div className="px-4 py-3">
                        <form onSubmit={handleSearch} className="mb-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Tìm sản phẩm..."
                                    className="w-full pl-4 pr-12 py-2.5 rounded-full border border-ocean-200 bg-ocean-50 focus:bg-white focus:border-ocean-400 outline-none text-sm"
                                />
                                <button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-ocean-500 flex items-center justify-center">
                                    <Search className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </form>

                        <nav className="flex flex-col gap-1">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="px-3 py-2.5 rounded-lg text-slate-700 hover:bg-ocean-50 hover:text-ocean-600 font-medium text-sm transition-colors"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>

                        {!session?.user && (
                            <div className="flex gap-2 mt-4 pb-2">
                                <Link
                                    href="/auth/login"
                                    className="flex-1 text-center py-2.5 rounded-full border border-ocean-300 text-ocean-600 text-sm font-medium"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    href="/auth/register"
                                    className="flex-1 text-center py-2.5 rounded-full bg-ocean-500 text-white text-sm font-semibold"
                                    onClick={() => setMobileOpen(false)}
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
