import HeroSlider from '@/components/home/HeroSlider';
import ProductSection from '@/components/home/ProductSection';
import MarqueeProductSection from '@/components/home/MarqueeProductSection';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hải Sản Quảng Ninh - Tươi Ngon Từ Biển',
  description: 'Chuyên cung cấp hải sản tươi sống chất lượng cao: tôm, cua, mực, cá từ vùng biển Quảng Ninh. Giao hàng nhanh, đảm bảo tươi ngon.',
};

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <MarqueeProductSection
          title="Sản phẩm Hot 🔥"
          subtitle="Những sản phẩm yêu thích nhất tháng này, chỉ có tại Hải Sản Quảng Ninh"
          queryParams={{ featured: 'true', pageSize: '10' }}
          viewAllHref="/products"
        />
        <ProductSection
          title="Bán chạy nhất ⭐"
          subtitle="Được khách hàng tin chọn nhiều nhất"
          queryParams={{ bestSeller: 'true', pageSize: '10' }}
          viewAllHref="/products?sort=discount"
        />
      </div>
    </>
  );
}
