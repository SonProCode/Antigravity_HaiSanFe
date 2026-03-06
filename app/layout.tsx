import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import Providers from '@/components/Providers';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: {
    default: 'Hải Sản Quảng Ninh - Tươi Ngon Từ Biển',
    template: '%s | Hải Sản Quảng Ninh',
  },
  description:
    'Chuyên cung cấp hải sản tươi sống chất lượng cao: tôm, cua, mực, cá từ vùng biển Quảng Ninh. Giao hàng nhanh, đảm bảo tươi ngon.',
  keywords: ['hải sản', 'tôm tươi', 'cua biển', 'mực tươi', 'Quảng Ninh', 'hải sản tươi sống'],
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://haisanquangninh.vn',
    siteName: 'Hải Sản Quảng Ninh',
    title: 'Hải Sản Quảng Ninh - Tươi Ngon Từ Biển',
    description: 'Chuyên cung cấp hải sản tươi sống chất lượng cao từ vùng biển Quảng Ninh.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body>
        <Providers>
          <Toaster position="top-right" />
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
