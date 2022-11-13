import { ProductModel } from "src/app/product/product.model";

export interface CartItemModel {
    id?: number;
    quantity: number;
    product: ProductModel
    cartId?: number;
}