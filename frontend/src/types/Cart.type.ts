export interface Cart {
  id: number | null;
  products: CartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export interface CartProduct {
  id: number | null;
  productId: number;
  cartId: number | null;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
  stock: number;
  minimumOrderQuantity: number;
}