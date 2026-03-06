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

export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const db = getDB();
    const user = db.users.find((u: { id: string }) => u.id === id);

    if (!user) return NextResponse.json({ message: 'Không tìm thấy user' }, { status: 404 });
    const { password: _, ...clean } = user;
    return NextResponse.json(clean);
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();

    const db = getDB();
    const index = db.users.findIndex((u: { id: string }) => u.id === id);
    if (index < 0) return NextResponse.json({ message: 'Không tìm thấy user' }, { status: 404 });

    // Don't allow updating password or role to admin via this route
    const { password: _p, role: _r, ...safeUpdates } = body;
    db.users[index] = { ...db.users[index], ...safeUpdates };
    saveDB(db);

    const { password: _pw, ...clean } = db.users[index];
    return NextResponse.json(clean);
}
