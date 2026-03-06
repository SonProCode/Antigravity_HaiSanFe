import Link from 'next/link';

const CATEGORIES = [
    { slug: 'tom', label: 'Tôm', emoji: '🦐', color: 'from-rose-50 to-rose-100 border-rose-200 hover:border-rose-400' },
    { slug: 'ca', label: 'Cá', emoji: '🐟', color: 'from-sky-50 to-sky-100 border-sky-200 hover:border-sky-400' },
    { slug: 'muc', label: 'Mực', emoji: '🦑', color: 'from-violet-50 to-violet-100 border-violet-200 hover:border-violet-400' },
    { slug: 'cua', label: 'Cua', emoji: '🦀', color: 'from-orange-50 to-orange-100 border-orange-200 hover:border-orange-400' },
    { slug: 'premium', label: 'Cao cấp', emoji: '⭐', color: 'from-amber-50 to-amber-100 border-amber-200 hover:border-amber-400' },
];

export default function CategorySection() {
    return (
        <section className="py-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-5">Danh mục sản phẩm</h2>
            <div className="grid grid-cols-5 gap-2 sm:gap-3">
                {CATEGORIES.map((cat) => (
                    <Link
                        key={cat.slug}
                        href={`/products?category=${cat.slug}`}
                        className={`flex flex-col items-center justify-center gap-1.5 p-3 sm:p-4 rounded-2xl bg-gradient-to-b border transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${cat.color}`}
                    >
                        <span className="text-2xl sm:text-3xl">{cat.emoji}</span>
                        <span className="text-xs sm:text-sm font-semibold text-slate-700 text-center">{cat.label}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
}
