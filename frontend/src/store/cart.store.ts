import { create } from "zustand";
import { CartProduct } from "@/types/Cart.type";

type AddProduct = Omit<CartProduct, "total" | "discountedTotal">

interface CartState {
  cartId: number | null;
  products: CartProduct[];
  total: number;
  addProduct: (product: AddProduct) => void;
  removeProduct: (id: number) => void;
  updateProduct: (id: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  cartId: null,
  products: [],
  total: 0,
  addProduct: (product) => {
    const existingProduct = get().products.find((p) => p.id === product.id);

    // If the product already exists in the cart, update its quantity
    if (existingProduct) {
      const updatedProducts = get().products.map((p) =>
        p.id === product.id
          ? {
            ...p,
            quantity: p.quantity + product.quantity,
            total: p.total + product.price * product.quantity,
            discountedTotal: p.discountedTotal + (product.price * product.quantity - (product.price * product.discountPercentage) / 100)
          }
          : p
      );
      const total = updatedProducts.reduce(
        (sum, p) => sum + p.discountedTotal,
        0
      );

      return set({ products: updatedProducts, total });
    }

    // If the product does not exist, add it to the cart
    const discountedTotal = product.price * product.quantity - (product.price * product.discountPercentage) / 100;
    const total = product.price * product.quantity;

    const newProduct = { ...product, discountedTotal, total };

    set((state) => ({
      products: [...state.products, newProduct],
      total: [...state.products, newProduct].reduce((sum, p) => sum + p.discountedTotal, 0),
    }));
  },
  removeProduct: (id) =>
    set((state) => {
      const filteredProducts = state.products.filter((p) => p.id !== id);
      const total = filteredProducts.reduce((sum, p) => sum + p.discountedTotal, 0);
      return { products: filteredProducts, total };
    }),
  updateProduct: (id: number, quantity: number) =>
    set((state) => {
      const updatedProducts = state.products.map((p) =>
        p.id === id
          ? {
            ...p,
            quantity,
            total: p.price * quantity,
            discountedTotal: p.price * quantity - (p.price * p.discountPercentage) / 100
          }
          : p
      );
      const total = updatedProducts.reduce(
        (sum, p) => sum + p.discountedTotal,
        0
      );
      return { products: updatedProducts, total };
    }),
  clearCart: () => set({ products: [], total: 0 }),
}));