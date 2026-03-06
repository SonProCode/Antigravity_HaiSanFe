import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem } from '@/types';
import { cartService } from '@/src/services/cart.service';

interface CartState {
    items: CartItem[];
    isOpen: boolean;
    isSyncing: boolean;
    addItem: (item: CartItem) => Promise<void>;
    updateItemWeight: (productId: string, weight: number) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    setOpen: (open: boolean) => void;
    fetchCart: () => Promise<void>;
    getTotal: () => number;
    getItemCount: () => number;
}


export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            isOpen: false,
            isSyncing: false,

            fetchCart: async () => {
                const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
                const sessionId = typeof window !== 'undefined' ? localStorage.getItem('sessionId') : null;

                if (!token && !sessionId) return;

                set({ isSyncing: true });
                try {
                    const serverCart = await cartService.getCart();
                    if (serverCart && serverCart.items) {
                        set({ items: serverCart.items });
                    }
                } catch (error) {
                    console.error('Failed to fetch cart:', error);
                } finally {
                    set({ isSyncing: false });
                }
            },

            addItem: async (newItem: CartItem) => {
                const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
                const sessionId = typeof window !== 'undefined' ? localStorage.getItem('sessionId') : null;

                if (token || sessionId) {
                    set({ isSyncing: true });
                    try {
                        const updatedServerCart = await cartService.addToCart(newItem.productId, newItem.weight);
                        set({ items: updatedServerCart.items });
                        return;
                    } catch (error) {
                        console.error('Failed to add to cart on server:', error);
                        throw error;
                    } finally {
                        set({ isSyncing: false });
                    }
                }

                // Fallback to local only for absolute guest (no session id yet - rare)
                set((state) => {
                    const existingIndex = state.items.findIndex(
                        (item) => item.productId === newItem.productId
                    );

                    if (existingIndex >= 0) {
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

            updateItemWeight: async (productId: string, weight: number) => {
                const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
                const sessionId = typeof window !== 'undefined' ? localStorage.getItem('sessionId') : null;

                if (token || sessionId) {
                    set({ isSyncing: true });
                    try {
                        const item = get().items.find((i) => i.productId === productId);
                        if (item?.id) {
                            const updatedServerCart = await cartService.updateItem(item.id, weight);
                            set({ items: updatedServerCart.items });
                        } else {
                            // Local fallback
                            set((state) => ({
                                items: state.items.map((i) =>
                                    i.productId === productId
                                        ? { ...i, weight, totalPrice: Math.round(i.pricePerKg * weight) }
                                        : i
                                ),
                            }));
                        }
                    } catch (error) {
                        console.error('Failed to update cart weight:', error);
                    } finally {
                        set({ isSyncing: false });
                    }
                } else {
                    set((state) => ({
                        items: state.items.map((item) =>
                            item.productId === productId
                                ? { ...item, weight, totalPrice: Math.round(item.pricePerKg * weight) }
                                : item
                        ),
                    }));
                }
            },

            removeItem: async (productId: string) => {
                const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
                const sessionId = typeof window !== 'undefined' ? localStorage.getItem('sessionId') : null;

                if (token || sessionId) {
                    set({ isSyncing: true });
                    try {
                        const item = get().items.find((i) => i.productId === productId);
                        if (item?.id) {
                            await cartService.removeItem(item.id);
                            await get().fetchCart();
                        } else {
                            set((state) => ({
                                items: state.items.filter((i) => i.productId !== productId),
                            }));
                        }
                    } catch (error) {
                        console.error('Failed to remove cart item:', error);
                    } finally {
                        set({ isSyncing: false });
                    }
                } else {
                    set((state) => ({
                        items: state.items.filter((item) => item.productId !== productId),
                    }));
                }
            },

            clearCart: async () => {
                const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
                if (token) {
                    try {
                        await cartService.clearCart();
                    } catch (error) {
                        console.error('Failed to clear cart on server:', error);
                    }
                }
                set({ items: [] });
            },

            setOpen: (open: boolean) => set({ isOpen: open }),

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
