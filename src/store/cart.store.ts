import { create } from "zustand";
import { CartProduct } from "@/types/Cart.type";

type AddProduct = Omit<CartProduct, "total" | "discountedTotal">

interface CartState {
  products: CartProduct[];
  total: number;
  addProduct: (product: AddProduct) => void;
  removeProduct: (id: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  products: [],
  total: 0,
  addProduct: (product) => {
    const discountedTotal = product.price * product.quantity - (product.price * product.discountPercentage) / 100;
    const total = product.price * product.quantity;

    const newProduct = { ...product, discountedTotal, total };

    set((state) => ({
      products: [...state.products, newProduct],
      total: state.total + discountedTotal,
    }));
  },
  removeProduct: (id) =>
    set((state) => {
      const filteredProducts = state.products.filter((p) => p.id !== id);
      const total = filteredProducts.reduce((sum, p) => sum + p.discountedTotal, 0);
      return { products: filteredProducts, total };
    }),
  clearCart: () => set({ products: [], total: 0 }),
}));