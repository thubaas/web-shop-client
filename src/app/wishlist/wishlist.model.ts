import { ProductModel } from "../product/product.model";

export interface WishlistModel {
    id?: number;
    product: ProductModel;
}