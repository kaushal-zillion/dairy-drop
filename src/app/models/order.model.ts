import { Product } from "./product.model";
export interface OrderItem {
    _id: string;
    product: Product;
    quantity: number;
}

export interface OrderResponse {
    _id: string;
    user: string;
    products: OrderItem[];
    totalAmount: number;
    status: string;
    paystatus: string;
    createdAt: string;
    updatedAt: string;
}
