import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: {},
  addItem: (product) => {
    const current = get().items[product.id];
    const nextQty = (current?.qty ?? 0) + 1;
    set({
      items: {
        ...get().items,
        [product.id]: { product, qty: nextQty },
      },
    });
  },
  removeItem: (productId) => {
    const next = { ...get().items };
    delete next[productId];
    set({ items: next });
  },
  clear: () => set({ items: {} }),
  totalCount: () =>
    Object.values(get().items).reduce((sum, row) => sum + row.qty, 0),
  totalPrice: () =>
    Object.values(get().items).reduce(
      (sum, row) => sum + row.product.price * row.qty,
      0,
    ),
}));
