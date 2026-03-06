import Link from 'next/link';
import { Phone, MapPin, Mail, Facebook, Youtube, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-ocean-950 text-ocean-100 mt-16">
            {/* Top */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-ocean-400 to-teal-500 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">HS</span>
                            </div>
                            <div>
                                <div className="font-bold text-white text-base leading-tight">Hải Sản Quảng Ninh</div>
                                <div className="text-ocean-400 text-xs">Tươi ngon từ biển</div>
                            </div>
                        </div>
                        <p className="text-ocean-300 text-sm leading-relaxed mb-4">
                            Chuyên cung cấp hải sản tươi sống chất lượng cao từ vùng biển Quảng Ninh.
                            Cam kết nguồn gốc rõ ràng, đóng gói chuẩn, giao hàng trong ngày.
                        </p>
                        {/* Social */}
                        <div className="flex gap-3">
                            {[
                                { icon: Facebook, href: '#', label: 'Facebook' },
                                { icon: Youtube, href: '#', label: 'Youtube' },
                                { icon: Instagram, href: '#', label: 'Instagram' },
                            ].map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="w-8 h-8 rounded-lg bg-ocean-800 hover:bg-ocean-600 flex items-center justify-center transition-colors"
                                >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Danh mục</h3>
                        <ul className="space-y-2">
                            {[
                                { href: '/products?category=tom', label: 'Tôm tươi' },
                                { href: '/products?category=ca', label: 'Cá biển' },
                                { href: '/products?category=muc', label: 'Mực & Bạch tuộc' },
                                { href: '/products?category=cua', label: 'Cua & Ghẹ' },
                                { href: '/products?category=premium', label: 'Hải sản cao cấp' },
                            ].map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-ocean-300 hover:text-white text-sm transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Hỗ trợ</h3>
                        <ul className="space-y-2">
                            {[
                                { href: '/about#policy', label: 'Chính sách mua hàng' },
                                { href: '/about#shipping', label: 'Chính sách giao hàng' },
                                { href: '/order/track', label: 'Tra cứu đơn hàng' },
                                { href: '/about#faq', label: 'Câu hỏi thường gặp' },
                                { href: '/about#preservation', label: 'Bảo quản hải sản' },
                            ].map((item) => (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className="text-ocean-300 hover:text-white text-sm transition-colors"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact & Newsletter */}
                    <div>
                        <h3 className="font-semibold text-white mb-4">Liên hệ</h3>
                        <ul className="space-y-3 mb-6">
                            <li className="flex items-start gap-2">
                                <MapPin className="w-4 h-4 text-ocean-400 mt-0.5 shrink-0" />
                                <span className="text-ocean-300 text-sm">123 Đường Hạ Long, TP. Hạ Long, Quảng Ninh</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-ocean-400 shrink-0" />
                                <a href="tel:19001234" className="text-ocean-300 hover:text-white text-sm transition-colors">1900 1234</a>
                            </li>
                            <li className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-ocean-400 shrink-0" />
                                <a href="mailto:info@haisanquangninh.vn" className="text-ocean-300 hover:text-white text-sm transition-colors">info@haisanquangninh.vn</a>
                            </li>
                        </ul>

                        {/* Newsletter */}
                        <div>
                            <p className="text-sm text-ocean-300 mb-2">Nhận ưu đãi qua email:</p>
                            <form className="flex gap-2">
                                <input
                                    type="email"
                                    placeholder="Email của bạn"
                                    className="flex-1 px-3 py-2 rounded-lg bg-ocean-800 border border-ocean-700 text-sm text-white placeholder:text-ocean-500 focus:outline-none focus:border-ocean-400"
                                />
                                <button
                                    type="submit"
                                    className="px-3 py-2 bg-ocean-500 hover:bg-ocean-400 rounded-lg text-white text-sm font-medium transition-colors"
                                >
                                    Gửi
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-ocean-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-2">
                    <p className="text-ocean-400 text-xs">
                        © 2026 Hải Sản Quảng Ninh. Tất cả quyền được bảo lưu.
                    </p>
                    <p className="text-ocean-500 text-xs">
                        Mã số thuế: 0100112222 | ĐKKD: tại Quảng Ninh
                    </p>
                </div>
            </div>
        </footer>
    );
}
