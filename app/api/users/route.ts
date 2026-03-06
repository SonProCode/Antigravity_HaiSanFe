import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

function getDB() {
    const dbPath = path.join(process.cwd(), 'data', 'db.json');
    const raw = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(raw);
}

function saveDB(db: unknown) {
    const dbPath = path.join(process.cwd(), 'data', 'db.json');
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
}

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '20');

    const db = getDB();
    const users = (db.users || []).map(({ password: _, ...u }: { password: string }) => u);
    const total = users.length;
    const totalPages = Math.ceil(total / pageSize);
    const paginated = users.slice((page - 1) * pageSize, page * pageSize);

    return NextResponse.json({ data: paginated, total, page, pageSize, totalPages });
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const db = getDB();

    const newUser = {
        id: `user_${Date.now()}`,
        ...body,
        role: body.role || 'user',
        isActive: true,
        createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    saveDB(db);

    const { password: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 });
}
