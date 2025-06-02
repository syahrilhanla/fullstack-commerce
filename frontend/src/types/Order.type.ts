import { Product } from "./Product.type";

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  order: number;
  product: Product;
  user: number;
}

export interface Order {
  id: number;
  externalId: string | null;
  orderItems: OrderItem[];
  totalPrice: number;
  orderStatus: "pending" | "paid" | string;
  createdAt: string;
  updatedAt: string;
  user: number;
};