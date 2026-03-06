import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import type { Order } from '@/types';

function getDB() {
    const dbPath = path.join(process.cwd(), 'data', 'db.json');
    const raw = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(raw);
}

function saveDB(db: unknown) {
    const dbPath = path.join(process.cwd(), 'data', 'db.json');
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const db = getDB();
    const order = db.orders.find((o: Order) => o.id === id || o.orderId === id);

    if (!order) {
        return NextResponse.json({ message: 'Không tìm thấy đơn hàng' }, { status: 404 });
    }

    return NextResponse.json(order);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();

    const db = getDB();
    const index = db.orders.findIndex((o: Order) => o.id === id);

    if (index < 0) {
        return NextResponse.json({ message: 'Không tìm thấy đơn hàng' }, { status: 404 });
    }

    const order = db.orders[index];

    if (body.status && body.status !== order.status) {
        const newEntry = {
            status: body.status,
            timestamp: new Date().toISOString(),
            note: body.note || '',
        };
        order.status = body.status;
        order.statusTimeline = [...(order.statusTimeline || []), newEntry];
    }

    db.orders[index] = { ...order, ...body, status: order.status, statusTimeline: order.statusTimeline };
    saveDB(db);

    return NextResponse.json(db.orders[index]);
}
