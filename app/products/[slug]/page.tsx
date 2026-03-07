import { Metadata } from 'next';
import ProductDetailClient from '@/components/product/ProductDetailClient';
import { productService } from '@/src/services/product.service';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    try {
        const product = await productService.getBySlug(slug);
        if (!product) return { title: 'Sản phẩm' };
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
