import { CartItemModel } from "./cart-item/cart-item.model";

export interface CartModel {
    id: number;
    totalCost: number;
    creationDate: Date;
    items: CartItemModel[];
    userId: number;
}