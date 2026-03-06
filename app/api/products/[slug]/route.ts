import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { Product } from '@/types';

function getDB() {
    try {
        const dbPath = path.join(process.cwd(), 'data', 'db.json');
        const raw = fs.readFileSync(dbPath, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return { products: [], users: [], orders: [], reviews: [] };
    }
}

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const db = getDB();
    const product = db.products.find((p: Product) => p.slug === slug);

    if (!product) {
        return NextResponse.json({ message: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    // Get related products (same category, max 8)
    const related = db.products
        .filter((p: Product) => p.category === product.category && p.id !== product.id)
        .slice(0, 8)
        .map((p: Product) => ({
            id: p.id,
            slug: p.slug,
            name: p.name,
            images: p.images,
            price: p.price,
            salePrice: p.salePrice,
            percentOff: p.percentOff,
            rating: p.rating,
            soldCount: p.soldCount,
            isBaoRe: p.isBaoRe,
        }));

    // Get reviews for this product
    const reviews = db.reviews?.filter((r: { productId: string }) => r.productId === product.id) || [];

    return NextResponse.json({ ...product, relatedProducts: related, reviews });
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const body = await request.json();
    const db = getDB();
    const index = db.products.findIndex((p: Product) => p.slug === slug);

    if (index < 0) {
        return NextResponse.json({ message: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    db.products[index] = { ...db.products[index], ...body };
    const dbPath = path.join(process.cwd(), 'data', 'db.json');
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    return NextResponse.json(db.products[index]);
}

export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;
    const db = getDB();
    const index = db.products.findIndex((p: Product) => p.slug === slug);

    if (index < 0) {
        return NextResponse.json({ message: 'Không tìm thấy sản phẩm' }, { status: 404 });
    }

    db.products.splice(index, 1);
    const dbPath = path.join(process.cwd(), 'data', 'db.json');
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    return NextResponse.json({ message: 'Đã xóa sản phẩm' });
}
