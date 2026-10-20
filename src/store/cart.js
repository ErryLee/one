import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: {},
  addItem: (product) => {
    const current = get().items[product.id]?.qty ?? 0;
    if (current >= product.stock) {
      return { added: false, limited: true, qty: current, stock: product.stock };
    }
    const nextQty = current + 1;
    set({
      items: {
        ...get().items,
        [product.id]: { product, qty: nextQty },
      },
    });
    return {
      added: true,
      limited: nextQty >= product.stock,
      qty: nextQty,
      stock: product.stock,
    };
  },
  setQty: (productId, qty) => {
    const row = get().items[productId];
    if (!row) return { removed: false, limited: false, qty: 0, stock: 0 };
    if (qty <= 0) {
      const next = { ...get().items };
      delete next[productId];
      set({ items: next });
      return { removed: true, limited: false, qty: 0, stock: row.product.stock };
    }
    const nextQty = Math.min(qty, row.product.stock);
    set({
      items: {
        ...get().items,
        [productId]: { ...row, qty: nextQty },
      },
    });
    return {
      removed: false,
      limited: qty > row.product.stock,
      qty: nextQty,
      stock: row.product.stock,
    };
  },
  removeItem: (productId) => {
    const next = { ...get().items };
    delete next[productId];
    set({ items: next });
  },
  clear: () => set({ items: {} }),
}));
