import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { Order } from '@/types';

function getDB() {
    try {
        const dbPath = path.join(process.cwd(), 'data', 'db.json');
        const raw = fs.readFileSync(dbPath, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return { products: [], users: [], orders: [], reviews: [] };
    }
}

function saveDB(db: unknown) {
    const dbPath = path.join(process.cwd(), 'data', 'db.json');
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

function generateOrderId(): string {
    const year = 2026;
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `HAI-${year}-${random}`;
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const phone = searchParams.get('phone');
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const db = getDB();
    let orders: Order[] = db.orders || [];

    if (orderId) {
        const found = orders.find((o: Order) => o.orderId === orderId);
        if (!found) {
            return NextResponse.json({ message: 'Không tìm thấy đơn hàng' }, { status: 404 });
        }
        return NextResponse.json(found);
    }

    if (phone) {
        const found = orders.filter((o: Order) => o.shipping.phone === phone);
        return NextResponse.json({ data: found });
    }

    if (userId) {
        orders = orders.filter((o: Order) => o.userId === userId);
    }

    const total = orders.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginated = orders.slice((page - 1) * pageSize, page * pageSize);

    return NextResponse.json({ data: paginated, total, page, pageSize, totalPages });
}

export async function POST(request: NextRequest) {
    const body = await request.json();

    const db = getDB();
    const subtotal = body.items.reduce(
        (s: number, i: { totalPrice: number }) => s + i.totalPrice,
        0
    );
    const shippingFee = subtotal >= 500000 ? 0 : 30000;
    const total = subtotal + shippingFee;

    const newOrder: Order = {
        id: `order_${Date.now()}`,
        orderId: generateOrderId(),
        userId: body.userId,
        items: body.items,
        shipping: body.shipping,
        paymentMethod: body.paymentMethod,
        subtotal,
        shippingFee,
        total,
        status: 'pending',
        statusTimeline: [
            {
                status: 'pending',
                timestamp: new Date().toISOString(),
                note: 'Đơn hàng đã được tạo',
            },
        ],
        createdAt: new Date().toISOString(),
    };

    db.orders.push(newOrder);
    saveDB(db);

    return NextResponse.json(
        { orderId: newOrder.orderId, status: 'pending', order: newOrder },
        { status: 201 }
    );
}
