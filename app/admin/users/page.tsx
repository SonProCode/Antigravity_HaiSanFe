'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Search, Edit, Trash2, User as UserIcon, Shield, ShieldAlert } from 'lucide-react';
import type { User } from '@/types';

async function fetchUsers(page = 1) {
    const res = await fetch(`/api/users?page=${page}&pageSize=20`);
    return res.json();
}

async function updateUser(id: string, data: Partial<User>) {
    const res = await fetch(`/api/users/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update user');
    return res.json();
}

export default function AdminUsersPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['admin-users', page],
        queryFn: () => fetchUsers(page),
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<User> }) => updateUser(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['admin-users'] });
            setEditingUser(null);
        },
    });

    const users: User[] = data?.data || [];
    const filtered = users.filter((u) =>
        !search ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleToggleStatus = (user: User) => {
        if (confirm(`Bạn có chắc chắn muốn ${user.isActive ? 'khóa' : 'mở khóa'} người dùng ${user.name}?`)) {
            updateMutation.mutate({ id: user.id, data: { isActive: !user.isActive } });
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Quản lý người dùng</h1>
                    <p className="text-slate-500 text-sm">{data?.total || 0} thành viên</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm theo tên hoặc email..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-ocean-400"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Người dùng</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Vai trò</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Trạng thái</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Ngày tạo</th>
                                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading
                                ? Array.from({ length: 8 }).map((_, i) => (
                                    <tr key={i}>
                                        <td className="px-4 py-3"><div className="skeleton h-10 w-10 rounded-full" /></td>
                                        <td className="px-4 py-3"><div className="skeleton h-4 w-20" /></td>
                                        <td className="px-4 py-3"><div className="skeleton h-4 w-24" /></td>
                                        <td className="px-4 py-3"><div className="skeleton h-4 w-24" /></td>
                                        <td className="px-4 py-3"><div className="skeleton h-4 w-16" /></td>
                                    </tr>
                                ))
                                : filtered.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full overflow-hidden bg-ocean-50 shrink-0 border border-ocean-100">
                                                    {u.image ? (
                                                        <img src={u.image} alt={u.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-ocean-600 font-bold text-xs bg-ocean-50">
                                                            {u.name[0].toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-800">{u.name}</p>
                                                    <p className="text-xs text-slate-500">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-1.5">
                                                {u.role === 'admin' ? (
                                                    <Shield className="w-4 h-4 text-purple-600" />
                                                ) : (
                                                    <UserIcon className="w-4 h-4 text-slate-400" />
                                                )}
                                                <span className={`text-xs font-medium ${u.role === 'admin' ? 'text-purple-600' : 'text-slate-600'}`}>
                                                    {u.role === 'admin' ? 'Quản trị' : 'Thành viên'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${u.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                                }`}>
                                                {u.isActive ? 'Hoạt động' : 'Đã khóa'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-500">
                                            {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setEditingUser(u)}
                                                    className="p-1.5 text-slate-400 hover:text-ocean-600 hover:bg-ocean-50 rounded-lg transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                {u.role !== 'admin' && (
                                                    <button
                                                        onClick={() => handleToggleStatus(u)}
                                                        className={`p-1.5 rounded-lg transition-colors ${u.isActive ? 'text-slate-400 hover:text-red-500 hover:bg-red-50' : 'text-red-400 hover:text-green-500 hover:bg-green-50'
                                                            }`}
                                                        title={u.isActive ? 'Khóa người dùng' : 'Mở khóa người dùng'}
                                                    >
                                                        <ShieldAlert className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {data?.totalPages > 1 && (
                    <div className="flex justify-center gap-2 p-4 border-t border-slate-100">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:border-ocean-300 disabled:opacity-40"
                        >
                            ←
                        </button>
                        <span className="px-3 py-1.5 text-sm text-slate-600">
                            {page} / {data.totalPages}
                        </span>
                        <button
                            disabled={page >= data.totalPages}
                            onClick={() => setPage((p) => p + 1)}
                            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:border-ocean-300 disabled:opacity-40"
                        >
                            →
                        </button>
                    </div>
                )}
            </div>

            {/* User Modal */}
            {editingUser && (
                <UserModal
                    user={editingUser}
                    onClose={() => setEditingUser(null)}
                    onSave={(data) => updateMutation.mutate({ id: editingUser.id, data })}
                    isSaving={updateMutation.isPending}
                />
            )}
        </div>
    );
}

function UserModal({
    user,
    onClose,
    onSave,
    isSaving,
}: {
    user: User;
    onClose: () => void;
    onSave: (data: Partial<User>) => void;
    isSaving: boolean;
}) {
    const [form, setForm] = useState({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
    });

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <h2 className="font-bold text-slate-800">Chỉnh sửa người dùng</h2>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">✕</button>
                </div>

                <div className="p-5 space-y-4">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-ocean-100">
                            {user.image ? (
                                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-ocean-600 font-bold text-xl bg-ocean-50">
                                    {user.name[0].toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">{user.name}</p>
                            <p className="text-sm text-slate-500">{user.email}</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Họ tên</label>
                        <input
                            value={form.name}
                            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-ocean-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Số điện thoại</label>
                        <input
                            value={form.phone}
                            onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-ocean-400"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Địa chỉ</label>
                        <textarea
                            value={form.address}
                            onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))}
                            rows={3}
                            className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-ocean-400 resize-none"
                        />
                    </div>
                </div>

                <div className="flex gap-3 p-5 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={() => onSave(form)}
                        disabled={isSaving}
                        className="flex-1 py-2.5 bg-ocean-500 text-white rounded-xl text-sm font-semibold hover:bg-ocean-600 disabled:opacity-70"
                    >
                        {isSaving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </div>
        </div>
    );
}
