import { create } from "zustand";
import { CartProduct } from "@/types/Cart.type";
import { persist, createJSONStorage, } from "zustand/middleware";
import { countDiscountedPrice } from "@/helpers/helpers";

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

export const useCartStore = create<CartState>()(persist((set, get) => ({
  cartId: null,
  products: [],
  total: 0,
  addProduct: (product) => {
    const existingProduct = get().products.find((p) => p.productId === product.productId);

    // If the product already exists in the cart, update its quantity
    if (existingProduct) {
      const updatedProducts = get().products.map((p) =>
        p.productId === product.productId
          ? {
            ...p,
            quantity: p.quantity + product.quantity,
            total: p.total + product.price * product.quantity,
            discountedTotal: countDiscountedPrice(
              p.price * 1000,
              p.discountPercentage
            ) * p.quantity
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
    const discountedTotal = countDiscountedPrice(
      product.price * 1000,
      product.discountPercentage
    ) * product.quantity;
    const total = product.price * product.quantity;

    const newProduct = { ...product, discountedTotal, total };

    set((state) => ({
      products: [...state.products, newProduct],
      total: [...state.products, newProduct].reduce((sum, p) => sum + p.discountedTotal, 0),
    }));
  },
  removeProduct: (productId) =>
    set((state) => {
      const filteredProducts = state.products.filter((p) => p.productId !== productId);
      const total = filteredProducts.reduce((sum, p) => sum + p.discountedTotal, 0);
      return { products: filteredProducts, total };
    }),
  updateProduct: (productId: number, quantity: number) =>
    set((state) => {
      const updatedProducts = state.products.map((p) =>
        p.productId === productId
          ? {
            ...p,
            quantity,
            total: p.price * quantity,
            discountedTotal: countDiscountedPrice(
              p.price * 1000,
              p.discountPercentage
            ) * quantity
          }
          : p
      );
      const total = updatedProducts.reduce(
        (sum, p) => sum + p.discountedTotal,
        0
      );
      return { products: updatedProducts, total };
    }),
  clearCart: () => {
    set({ products: [], total: 0 });
    localStorage.removeItem("cart-storage"); // Clear cart from local storage
  }
}), {
  name: "cart-storage", // unique name
  storage: createJSONStorage(() => localStorage)
}));