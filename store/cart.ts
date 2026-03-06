import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem } from '@/types';

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    addItem: (item: CartItem) => void;
    updateItemWeight: (productId: string, weight: number) => void;
    removeItem: (productId: string) => void;
    clearCart: () => void;
    setOpen: (open: boolean) => void;
    mergeCart: (serverItems: CartItem[]) => void;
    getTotal: () => number;
    getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,

            addItem: (newItem: CartItem) => {
                set((state) => {
                    const existingIndex = state.items.findIndex(
                        (item) => item.productId === newItem.productId
                    );

                    if (existingIndex >= 0) {
                        // Update existing item - add weight
                        const updatedItems = [...state.items];
                        const existing = updatedItems[existingIndex];
                        const newWeight = Math.round((existing.weight + newItem.weight) * 10) / 10;
                        updatedItems[existingIndex] = {
                            ...existing,
                            weight: newWeight,
                            totalPrice: Math.round(existing.pricePerKg * newWeight),
                        };
                        return { items: updatedItems };
                    }

                    return { items: [...state.items, newItem] };
                });
            },

            updateItemWeight: (productId: string, weight: number) => {
                set((state) => ({
                    items: state.items.map((item) =>
                        item.productId === productId
                            ? {
                                ...item,
                                weight,
                                totalPrice: Math.round(item.pricePerKg * weight),
                            }
                            : item
                    ),
                }));
            },

            removeItem: (productId: string) => {
                set((state) => ({
                    items: state.items.filter((item) => item.productId !== productId),
                }));
            },

            clearCart: () => set({ items: [] }),

            setOpen: (open: boolean) => set({ isOpen: open }),

            mergeCart: (serverItems: CartItem[]) => {
                set((state) => {
                    const merged = [...state.items];
                    for (const serverItem of serverItems) {
                        const existingIdx = merged.findIndex(
                            (i) => i.productId === serverItem.productId
                        );
                        if (existingIdx < 0) {
                            merged.push(serverItem);
                        }
                    }
                    return { items: merged };
                });
            },

            getTotal: () => {
                return get().items.reduce((sum, item) => sum + item.totalPrice, 0);
            },

            getItemCount: () => {
                return get().items.length;
            },
        }),
        {
            name: 'haisan-cart',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
