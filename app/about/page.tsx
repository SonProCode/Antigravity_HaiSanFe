import Image from 'next/image';
import { Shield, Truck, RotateCcw, Clock, Fish, Award, Phone } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Về chúng tôi',
    description: 'Tìm hiểu về Hải Sản Quảng Ninh - chính sách mua hàng, giao hàng và cam kết chất lượng.',
};

const FAQ_ITEMS = [
    { q: 'Hải sản có đảm bảo tươi sống không?', a: 'Tất cả hải sản được đánh bắt hàng ngày và vận chuyển bằng xe lạnh. Chúng tôi cam kết 100% tươi sống khi nhận hàng.' },
    { q: 'Thời gian giao hàng bao lâu?', a: 'Trong nội thành Hà Nội và HCM: 2-4 tiếng. Tỉnh lân cận: 4-8 tiếng. Tỉnh xa: 12-24 tiếng.' },
    { q: 'Có thể đổi trả hàng không?', a: 'Chúng tôi chấp nhận đổi trả trong 24 giờ nếu sản phẩm không đúng chất lượng cam kết. Miễn phí ship lại.' },
    { q: 'Làm sao để bảo quản hải sản?', a: 'Hải sản tươi nên bảo quản ngăn đá tủ lạnh, sử dụng trong 24-48 giờ. Hải sản còn sống nên nấu ngay để đảm bảo hương vị tốt nhất.' },
    { q: 'Đặt hàng số lượng lớn có ưu đãi không?', a: 'Có! Đơn hàng từ 2 triệu đồng trở lên được giảm 5%, từ 5 triệu được giảm 10%. Liên hệ hotline để biết thêm chi tiết.' },
];

const PROCESS_STEPS = [
    { icon: Fish, title: 'Đánh bắt tươi', desc: 'Hải sản được đánh bắt và khai thác mỗi sáng từ vùng biển Quảng Ninh.' },
    { icon: Shield, title: 'Kiểm định chất lượng', desc: 'Qua 3 bước kiểm tra: ngoại quan, mùi vị, và độ tươi trước khi đóng gói.' },
    { icon: Clock, title: 'Đóng gói lạnh', desc: 'Đóng gói bằng thùng xốp cách nhiệt + đá khô để duy trì nhiệt độ 0-4°C.' },
    { icon: Truck, title: 'Giao hàng nhanh', desc: 'Vận chuyển bằng xe lạnh chuyên dụng. Giao tại nhà trong 2-4 tiếng.' },
];

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
            {/* Hero */}
            <section className="text-center">
                <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4">Về Hải Sản Quảng Ninh</h1>
                <p className="text-slate-600 text-lg leading-relaxed max-w-2xl mx-auto">
                    Chúng tôi là đơn vị cung cấp hải sản tươi sống hàng đầu Quảng Ninh, từ tôm, cua, mực, cá cho đến đặc sản biển cao cấp.
                    Với hơn 10 năm kinh nghiệm, chúng tôi cam kết mang đến sản phẩm chất lượng nhất đến tay bạn.
                </p>
            </section>

            {/* Stats */}
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { value: '10+', label: 'Năm kinh nghiệm' },
                    { value: '50,000+', label: 'Khách hàng hài lòng' },
                    { value: '40+', label: 'Loại hải sản' },
                    { value: '99%', label: 'Đánh giá tích cực' },
                ].map(({ value, label }) => (
                    <div key={label} className="text-center p-4 bg-ocean-50 rounded-2xl">
                        <div className="text-3xl font-bold text-ocean-600 mb-1">{value}</div>
                        <div className="text-slate-600 text-sm">{label}</div>
                    </div>
                ))}
            </section>

            {/* Policies */}
            <section id="policy">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Chính sách mua hàng</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    {[
                        { icon: Shield, title: 'Cam kết chất lượng', desc: 'Hoàn tiền 100% hoặc giao lại nếu hải sản không tươi ngon như cam kết.' },
                        { icon: RotateCcw, title: 'Đổi trả miễn phí', desc: 'Đổi trả trong 24 giờ với sản phẩm lỗi. Miễn phí ship đổi trả.' },
                        { icon: Award, title: 'Nguồn gốc rõ ràng', desc: 'Mỗi sản phẩm có thông tin rõ ràng về vùng khai thác và ngày thu hoạch.' },
                        { icon: Phone, title: 'Hỗ trợ 24/7', desc: 'Hotline 1900 1234 sẵn sàng hỗ trợ bạn mọi lúc, kể cả ngày lễ.' },
                    ].map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="flex gap-4 p-4 bg-white border border-ocean-100 rounded-2xl">
                            <div className="w-12 h-12 rounded-xl bg-ocean-50 flex items-center justify-center shrink-0">
                                <Icon className="w-6 h-6 text-ocean-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
                                <p className="text-slate-600 text-sm">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Shipping */}
            <section id="shipping">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Chính sách giao hàng</h2>
                <div className="bg-ocean-50 rounded-2xl p-6 space-y-3">
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">🚚</span>
                        <div>
                            <h3 className="font-semibold text-slate-800">Miễn phí vận chuyển</h3>
                            <p className="text-slate-600 text-sm">Đơn hàng từ 500.000đ trở lên được miễn phí vận chuyển toàn quốc.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">❄️</span>
                        <div>
                            <h3 className="font-semibold text-slate-800">Giao hàng lạnh chuyên dụng</h3>
                            <p className="text-slate-600 text-sm">Hải sản được vận chuyển trong thùng cách nhiệt, đảm bảo nhiệt độ 0-4°C trong suốt hành trình.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <span className="text-2xl">⏱️</span>
                        <div>
                            <h3 className="font-semibold text-slate-800">Thời gian giao hàng</h3>
                            <p className="text-slate-600 text-sm">Nội thành HN/HCM: 2-4 tiếng | Tỉnh lân cận: 4-8 tiếng | Tỉnh xa: 12-24 tiếng</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Process */}
            <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Quy trình đóng gói</h2>
                <div className="grid sm:grid-cols-4 gap-4">
                    {PROCESS_STEPS.map(({ icon: Icon, title, desc }, i) => (
                        <div key={title} className="relative text-center p-4">
                            <div className="w-14 h-14 rounded-2xl bg-ocean-100 flex items-center justify-center mx-auto mb-3">
                                <Icon className="w-7 h-7 text-ocean-600" />
                            </div>
                            <div className="absolute top-8 left-full w-full h-0.5 bg-ocean-100 -translate-y-1/2 hidden sm:block last:hidden" />
                            <span className="inline-block text-xs font-bold text-ocean-500 mb-1">BƯỚC {i + 1}</span>
                            <h3 className="font-semibold text-slate-800 text-sm mb-1">{title}</h3>
                            <p className="text-slate-500 text-xs">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Preservation */}
            <section id="preservation">
                <h2 className="text-2xl font-bold text-slate-800 mb-4">Bảo quản & Nguồn gốc</h2>
                <div className="prose-haisan">
                    <p>Hải sản Quảng Ninh được khai thác từ vùng biển trong lành tại vịnh Hạ Long và các cảng cá Cẩm Phả, Móng Cái. Chúng tôi hợp tác trực tiếp với ngư dân địa phương để đảm bảo nguồn cung ổn định và truy xuất nguồn gốc minh bạch.</p>
                    <p className="mt-3"><strong>Bảo quản hải sản tươi:</strong> Bảo quản trong ngăn đá tủ, sử dụng trong 24-48 giờ sau khi nhận. Nên nấu ngay sau khi rã đông để giữ nguyên hương vị tươi ngon.</p>
                </div>
            </section>

            {/* FAQ */}
            <section id="faq">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Câu hỏi thường gặp</h2>
                <div className="space-y-3">
                    {FAQ_ITEMS.map(({ q, a }) => (
                        <div key={q} className="bg-white border border-ocean-100 rounded-2xl p-5">
                            <h3 className="font-semibold text-slate-800 mb-2 flex items-start gap-2">
                                <span className="text-ocean-500 mt-0.5">?</span>
                                {q}
                            </h3>
                            <p className="text-slate-600 text-sm leading-relaxed pl-5">{a}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
