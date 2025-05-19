export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discount_percentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  dimensions: Dimensions;
  warranty_information: string;
  shipping_information: string;
  availability_status: string;
  reviews: Review[];
  return_policy: string;
  minimum_order_quantity: number;
  meta: Meta;
  images: string[];
  thumbnail: string;
  created_at: string;
  updated_at: string;
}

export interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

export interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

export interface Meta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}