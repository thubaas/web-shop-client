import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Subject, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductModel } from '../product/product.model';
import { WishlistModel } from '../wishlist/wishlist.model';
import { CartItemModel } from './cart-item/cart-item.model';
import { CartModel } from './cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart: CartModel;
  cartChanged = new Subject<CartItemModel[]>();
  cartItems: CartItemModel[] = [];
  totalCost: number = 0;
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getCartItems() {
    return this.cartItems.slice();
  }

  addToCart(cartItem: CartItemModel) {
    return this.http.post<CartModel>(`${this.baseUrl}/carts/`, cartItem).pipe(
      catchError((errorRes) => this.handleError(errorRes)),
      tap((resData) => {
        this.setCart(resData);
        this.setCartItems(resData.items);
      })
    );
  }

  fetchCart() {
    const userJSON = localStorage.getItem('user');
    let user;
    if (userJSON !== null) {
      user = JSON.parse(userJSON);
    }
    return this.http.get<CartModel>(`${this.baseUrl}/carts/`).pipe(
      catchError((errorRes) => this.handleError(errorRes)),
      tap((resData) => {
        this.setCart(resData);
        this.setCartItems(resData.items);
      })
    );
  }

  moveAllToCart(wishlistItems: WishlistModel[]) {
    let userJSON = localStorage.getItem('user');
    let userData;
    if (userJSON !== null) userData = JSON.parse(userJSON);
    return this.http
      .get<CartModel>(`${environment.baseUrl}/users/${userData.id}/wishlists`)
      .pipe(
        catchError((errRes) => this.handleError(errRes)),
        tap((resData) => {
          this.setCart(resData);
          this.setCartItems(resData.items);
        })
      );
  }

  setCart(cart: CartModel) {
    this.cart = cart;
  }

  getCart() {
    return this.cart;
  }

  setCartItems(cartItems: CartItemModel[]) {
    this.cartItems = cartItems;
    this.cartChanged.next(this.cartItems.slice());
  }

  setTotalCost(totalCost: number) {
    this.totalCost = totalCost;
  }

  removeFromCart(index: number, cartItem: CartItemModel) {
    let userJSON = localStorage.getItem('user');
    let userData;
    if (userJSON !== null) userData = JSON.parse(userJSON);
    return this.http
      .delete<Boolean>(
        `${environment.baseUrl}/carts/${this.cart.id}/cart-items/${cartItem.id}`
      )
      .pipe(
        catchError((errorRes) => this.handleError(errorRes)),
        tap((resData) => {
          this.cart.items.splice(index, 1);
          this.cartItems = this.cart.items;
          this.cartChanged.next(this.cartItems.slice());
        })
      );
  }

  handleError(errRes: any) {
    console.log(errRes);
    return throwError(() => new Error(errRes));
  }
}
