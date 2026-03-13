'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Phone } from 'lucide-react';

const SLIDES = [
    {
        id: 1,
        title: 'Hải Sản Tươi Sống\nMỗi Ngày Từ Biển',
        subtitle: 'Chất lượng đảm bảo, nguồn gốc rõ ràng, giao hàng trong ngày tại Hà Nội, HCM',
        cta: 'Mua ngay',
        ctaHref: '/products',
        badge: '🚚 Miễn phí ship đơn từ 500K',
        bg: 'from-ocean-900 via-ocean-800 to-teal-900',
        image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=1200',
    },
    {
        id: 2,
        title: 'Tôm Hùm Xanh\nGiảm 20% Cuối Tuần',
        subtitle: 'Khuyến mãi đặc biệt cuối tuần - Tôm hùm tươi sống đánh bắt hàng ngày',
        cta: 'Xem khuyến mãi',
        ctaHref: '/products?category=tom',
        badge: '🔥 Flash Sale - Chỉ hôm nay',
        bg: 'from-teal-900 via-ocean-800 to-slate-900',
        image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=1200',
    },
    {
        id: 3,
        title: 'Bộ Quà Tặng\nHải Sản Cao Cấp',
        subtitle: 'Hộp quà tặng sang trọng: Tôm hùm + Bào ngư + Cua gạch - Giao trước 2 tiếng',
        cta: 'Xem Bộ quà',
        ctaHref: '/products?category=premium',
        badge: '🎁 Đóng hộp quà tặng đẹp',
        bg: 'from-slate-900 via-ocean-900 to-teal-800',
        image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=1200',
    },
];

export default function HeroSlider() {
    const [current, setCurrent] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const next = useCallback(() => {
        setCurrent((c) => (c + 1) % SLIDES.length);
    }, []);

    const prev = () => {
        setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
    };

    useEffect(() => {
        if (isHovered) return;
        const timer = setInterval(next, 4500);
        return () => clearInterval(timer);
    }, [isHovered, next]);

    const slide = SLIDES[current];

    return (
        <div
            className="relative overflow-hidden bg-ocean-900"
            style={{ height: 'clamp(320px, 55vw, 560px)' }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Background image */}
            <div className="absolute inset-0">
                <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className="object-cover transition-opacity duration-700"
                    priority
                />
                <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg} opacity-80`} />
            </div>

            {/* Content */}
            <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center pb-16 sm:pb-8">
                <div className="max-w-xl animate-fade-in-up">
                    <span className="inline-block px-3 py-1 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-[10px] sm:text-xs font-semibold rounded-full mb-3">
                        {slide.badge}
                    </span>

                    <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight whitespace-pre-line mb-2 sm:mb-3">
                        {slide.title}
                    </h1>

                    <p className="text-ocean-200 text-xs sm:text-base mb-4 sm:mb-6 leading-relaxed line-clamp-2 sm:line-clamp-none">
                        {slide.subtitle}
                    </p>

                    <div className="flex flex-wrap gap-2 sm:gap-3">
                        <Link
                            href={slide.ctaHref}
                            className="px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-ocean-800 font-bold rounded-full hover:bg-ocean-50 transition-colors shadow-lg text-xs sm:text-sm"
                        >
                            {slide.cta} →
                        </Link>
                        <a
                            href="tel:19001234"
                            className="px-5 py-2.5 sm:px-6 sm:py-3 bg-white/15 backdrop-blur-sm border border-white/30 text-white font-medium rounded-full hover:bg-white/25 transition-colors flex items-center gap-2 text-xs sm:text-sm"
                        >
                            <Phone className="w-3.5 h-3.5 sm:w-4 h-4" />
                            1900 1234
                        </a>
                    </div>
                </div>
            </div>

            {/* Nav buttons - hide on very small mobiles to save space */}
            <button
                onClick={prev}
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white transition-all"
            >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
                onClick={next}
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white transition-all"
            >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Dots - adjusted position */}
            <div className="absolute bottom-14 sm:bottom-12 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {SLIDES.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrent(i)}
                        className={`transition-all rounded-full ${i === current ? 'w-6 h-1.5 sm:h-2 bg-white' : 'w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white/40 hover:bg-white/70'
                            }`}
                    />
                ))}
            </div>

            {/* Free shipping banner - more descriptive for all screen sizes */}
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-r from-teal-600 to-ocean-600 py-2 sm:py-2.5 px-2 sm:px-4 shadow-lg border-t border-white/10">
                <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 sm:gap-8 text-white text-[10px] sm:text-xs font-bold tracking-tight">
                    <span className="flex items-center gap-1.5">🚚 Freeship đơn ≥ 500K</span>
                    <span className="flex items-center gap-1.5">❄️ Thực phẩm tươi sống</span>
                    <span className="flex items-center gap-1.5">✅ Đổi trả trong 24h</span>
                    <span className="flex items-center gap-1.5 text-orange-200">📞 1900 1234</span>
                </div>
            </div>
        </div>
    );
}
