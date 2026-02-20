export interface Product {
    _id: string;
    name: string;
    description: string;
    price: string;
    category: string;
    stock: string;
    image: String;
}

export interface CartProduct extends Product {
    qty: number;
}