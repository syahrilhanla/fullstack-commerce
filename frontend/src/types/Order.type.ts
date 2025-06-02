export interface Order {
  id: number;
  externalId: string | null;
  totalPrice: number;
  orderStatus: "pending" | "paid" | string;
  createdAt: string;
  updatedAt: string;
  user: number;
};