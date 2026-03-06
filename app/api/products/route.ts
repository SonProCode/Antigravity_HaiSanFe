import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { Product, ProductFilters } from '@/types';

function getDB() {
    try {
        const dbPath = path.join(process.cwd(), 'data', 'db.json');
        const raw = fs.readFileSync(dbPath, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return { products: [], users: [], orders: [], reviews: [] };
    }
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '12');
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || 'all';
    const sort = searchParams.get('sort') || 'newest';
    const bestSeller = searchParams.get('bestSeller') === 'true';
    const featured = searchParams.get('featured') === 'true';

    const db = getDB();
    let products: Product[] = db.products || [];

    // Filter by category
    if (category && category !== 'all') {
        products = products.filter((p: Product) => p.category === category);
    }

    // Filter by bestSeller
    if (bestSeller) {
        products = products.filter((p: Product) => p.bestSeller);
    }

    // Filter by featured (isBaoRe or salePrice)
    if (featured) {
        products = products.filter((p: Product) => p.isBaoRe || p.salePrice);
    }

    // Search
    if (q) {
        const query = q.toLowerCase();
        products = products.filter(
            (p: Product) =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
        );
    }

    // Sort
    switch (sort) {
        case 'price_asc':
            products.sort((a: Product, b: Product) => (a.salePrice || a.price) - (b.salePrice || b.price));
            break;
        case 'price_desc':
            products.sort((a: Product, b: Product) => (b.salePrice || b.price) - (a.salePrice || a.price));
            break;
        case 'discount':
            products.sort((a: Product, b: Product) => (b.percentOff || 0) - (a.percentOff || 0));
            break;
        case 'newest':
        default:
            products.sort(
                (a: Product, b: Product) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            break;
    }

    const total = products.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginatedProducts = products.slice((page - 1) * pageSize, page * pageSize);

    return NextResponse.json({
        data: paginatedProducts,
        total,
        page,
        pageSize,
        totalPages,
    });
}
