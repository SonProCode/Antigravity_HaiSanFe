import { Metadata } from 'next';
import ProductDetailClient from '@/components/product/ProductDetailClient';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
        const res = await fetch(`${apiUrl}/products/${slug}`);
        if (!res.ok) return { title: 'Sản phẩm' };
        const product = await res.json();
        return {
            title: product.name,
            description: product.shortDescription,
            openGraph: {
                title: product.name,
                description: product.shortDescription,
                images: [{ url: product.images?.[0] }],
            },
        };
    } catch {
        return { title: 'Sản phẩm' };
    }
}

export default async function ProductDetailPage({ params }: Props) {
    const resolvedParams = await params;
    return <ProductDetailClient slug={resolvedParams.slug} />;
}
