'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { formatCurrency, formatNumber, CATEGORY_LABELS } from '@/lib/utils';
import { Plus, Edit, Trash2, Search, Package, AlertTriangle } from 'lucide-react';
import type { Product, Category } from '@/types';

import { adminService } from '@/src/services/admin.service';

export default function AdminProductsPage() {
    const queryClient = useQueryClient();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [showLowStock, setShowLowStock] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);

    const { data, isLoading } = useQuery({
        queryKey: ['admin-products', page, search],
        queryFn: () => adminService.getProducts({ page, name: search, pageSize: 20 }),
    });

    const deleteMutation = useMutation({
        mutationFn: (id: string) => adminService.deleteProduct(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-products'] }),
    });

    const products: Product[] = data?.data || [];
    const filtered = products.filter((p) => {
        const matchStock = !showLowStock || p.inventoryKg < 5;
        return matchStock;
    });

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Quản lý sản phẩm</h1>
                    <p className="text-slate-500 text-sm">{data?.total || 0} sản phẩm</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-ocean-500 text-white font-semibold rounded-xl hover:bg-ocean-600 transition-colors text-sm"
                >
                    <Plus className="w-4 h-4" />
                    Thêm sản phẩm
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex flex-wrap gap-3">
                <div className="relative flex-1 min-w-48">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Tìm sản phẩm..."
                        className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm outline-none focus:border-ocean-400"
                    />
                </div>
                <button
                    onClick={() => setShowLowStock(!showLowStock)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${showLowStock ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                >
                    <AlertTriangle className="w-4 h-4" />
                    Sắp hết kho
                </button>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50">
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Sản phẩm</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Danh mục</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Giá</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Tồn kho</th>
                                <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Đã bán</th>
                                <th className="py-3 px-4 text-xs font-semibold text-slate-500 uppercase">Hành động</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading
                                ? Array.from({ length: 8 }).map((_, i) => (
                                    <tr key={i}>
                                        {Array.from({ length: 6 }).map((_, j) => (
                                            <td key={j} className="px-4 py-3"><div className="skeleton h-4 w-full" /></td>
                                        ))}
                                    </tr>
                                ))
                                : filtered.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-ocean-50 shrink-0">
                                                    <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-slate-800 line-clamp-1 max-w-48">{p.name}</p>
                                                    <p className="text-xs text-slate-400">{p.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="px-2 py-1 bg-ocean-50 text-ocean-700 rounded-full text-xs font-medium">
                                                {CATEGORY_LABELS[p.category]}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-sm font-semibold text-slate-800">{formatCurrency(p.salePrice || p.price)}</p>
                                            {p.salePrice && (
                                                <p className="text-xs text-slate-400 line-through">{formatCurrency(p.price)}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`text-sm font-medium ${p.inventoryKg < 5 ? 'text-red-500' : 'text-green-600'}`}>
                                                {p.inventoryKg}kg
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-slate-600">{formatNumber(p.soldCount)}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2 justify-center">
                                                <button
                                                    onClick={() => setEditingProduct(p)}
                                                    className="p-1.5 text-slate-400 hover:text-ocean-600 hover:bg-ocean-50 rounded-lg transition-colors"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm(`Xóa "${p.name}"?`)) deleteMutation.mutate(p.id);
                                                    }}
                                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
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
                            onClick={() => setPage(p => p - 1)}
                            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:border-ocean-300 disabled:opacity-40"
                        >
                            ←
                        </button>
                        <span className="px-3 py-1.5 text-sm text-slate-600">{page} / {data.totalPages}</span>
                        <button
                            disabled={page >= data.totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:border-ocean-300 disabled:opacity-40"
                        >
                            →
                        </button>
                    </div>
                )}
            </div>

            {/* Edit/Add Modal */}
            {(editingProduct || showAddModal) && (
                <ProductModal
                    product={editingProduct || undefined}
                    onClose={() => { setEditingProduct(null); setShowAddModal(false); }}
                    onSuccess={() => {
                        queryClient.invalidateQueries({ queryKey: ['admin-products'] });
                        setEditingProduct(null);
                        setShowAddModal(false);
                    }}
                />
            )}
        </div>
    );
}

function ProductModal({ product, onClose, onSuccess }: { product?: Product; onClose: () => void; onSuccess: () => void }) {
    const [form, setForm] = useState({
        name: product?.name || '',
        category: product?.category || 'tom',
        price: product?.originalPrice || product?.price || 0, // Base price (original)
        salePrice: product?.originalPrice ? product?.price : '', // Discounted price
        inventoryKg: product?.inventoryKg || 0,
        shortDescription: product?.description || '', // Match backend field
        origin: product?.origin || 'Quảng Ninh',
        preservation: product?.preservation || 'Bảo quản lạnh 0-4°C.',
        images: product?.images || [] as string[],
    });
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const { url } = await adminService.uploadImage(file);
            setForm(f => ({ ...f, images: [...f.images, url] }));
        } catch (err) {
            console.error('Upload error:', err);
        } finally {
            setUploading(false);
            e.target.value = '';
        }
    }

    function removeImage(url: string) {
        setForm(f => ({ ...f, images: f.images.filter(img => img !== url) }));
    }

    async function handleSave() {
        if (!form.name || !form.category) return;
        setSaving(true);
        try {
            // Mapping for Backend:
            // - Backend 'price' is always the ACTIVE price (what customer pays).
            // - Backend 'originalPrice' is the STRIKE-THROUGH price (optional).
            const basePrice = Number(form.price);
            const salePrice = form.salePrice ? Number(form.salePrice) : null;

            const isDiscounted = salePrice !== null && salePrice > 0;
            const finalActivePrice = isDiscounted ? salePrice : basePrice;
            const finalOriginalPrice = isDiscounted ? basePrice : null;

            const body = {
                name: form.name,
                category: form.category.toUpperCase(),
                price: finalActivePrice,
                originalPrice: finalOriginalPrice,
                inventoryKg: Number(form.inventoryKg),
                description: form.shortDescription,
                images: form.images,
            };

            if (product) {
                await adminService.updateProduct(product.id, body);
            } else {
                await adminService.createProduct(body);
            }
            onSuccess();
        } catch (err) {
            console.error('Save product error:', err);
            // Alert user about the error if needed
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-5 border-b border-slate-100">
                    <h2 className="font-bold text-slate-800">{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
                    <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">✕</button>
                </div>

                <div className="p-5 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Tên sản phẩm</label>
                        <input
                            value={form.name}
                            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-ocean-400"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Danh mục</label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm(f => ({ ...f, category: e.target.value as Category }))}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-ocean-400 bg-white"
                            >
                                {(Object.keys(CATEGORY_LABELS) as (Category | 'all')[]).filter(k => k !== 'all').map((k) => (
                                    <option key={k} value={k}>{CATEGORY_LABELS[k]}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Xuất xứ</label>
                            <input
                                value={form.origin}
                                onChange={(e) => setForm(f => ({ ...f, origin: e.target.value }))}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-ocean-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Giá niêm yết (đ/kg)</label>
                            <input
                                type="number"
                                value={form.price}
                                onChange={(e) => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-ocean-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Giá khuyến mãi (đ/kg)</label>
                            <input
                                type="number"
                                value={form.salePrice}
                                onChange={(e) => setForm(f => ({ ...f, salePrice: e.target.value }))}
                                placeholder="Để trống nếu không giảm"
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-ocean-400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Tồn kho (kg)</label>
                            <input
                                type="number"
                                value={form.inventoryKg}
                                onChange={(e) => setForm(f => ({ ...f, inventoryKg: Number(e.target.value) }))}
                                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-ocean-400"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Hình ảnh sản phẩm (Tối đa 5)</label>
                        <div className="grid grid-cols-4 gap-2 mb-3">
                            {form.images.map((url, idx) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                                    <img src={url} alt="product" className="w-full h-full object-cover" />
                                    <button
                                        onClick={() => removeImage(url)}
                                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                            {form.images.length < 5 && (
                                <label className={`aspect-square border-2 border-dashed border-slate-200 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-ocean-300 transition-colors ${uploading ? 'pointer-events-none opacity-50' : ''}`}>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleUpload} />
                                    {uploading ? (
                                        <div className="w-4 h-4 border-2 border-ocean-500 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span className="text-xl text-slate-400">+</span>
                                            <span className="text-[10px] text-slate-400">Tải lên</span>
                                        </>
                                    )}
                                </label>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả ngắn</label>
                        <textarea
                            value={form.shortDescription}
                            onChange={(e) => setForm(f => ({ ...f, shortDescription: e.target.value }))}
                            rows={3}
                            placeholder="Nhập mô tả sản phẩm..."
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:border-ocean-400 resize-none"
                        />
                    </div>
                </div>

                <div className="flex gap-3 p-5 border-t border-slate-100">
                    <button
                        onClick={onClose}
                        className="flex-1 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex-1 py-2.5 bg-ocean-500 text-white rounded-xl text-sm font-semibold hover:bg-ocean-600 disabled:opacity-70 transition-colors"
                    >
                        {saving ? 'Đang lưu...' : 'Xác nhận'}
                    </button>
                </div>
            </div>
        </div>
    );
}
