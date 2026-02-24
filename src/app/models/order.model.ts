export interface OrderResponse {
    user: string;
    products: [{
        product: string,
        quantity: number
    }];
    totalAmount: number;
    paystatus: string;
}
