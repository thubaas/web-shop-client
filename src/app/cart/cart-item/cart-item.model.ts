import { ProductModel } from "src/app/product/product.model";

export interface CartItemModel {
    id: number;
    quantity: number;
    productId: number;
    productName: string;
    imageUrl: string;
    price: number;
    cartId?: number;
}

