import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Subject, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { WishlistModel } from '../wishlist/wishlist.model';
import { CartItemModel } from './cart-item/cart-item.model';
import { CartModel } from './cart.model';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cart: CartModel;

  cartChanged = new Subject<CartItemModel[]>();
  totalCostChanged = new Subject<number>();
  cartItems: CartItemModel[] = [];
  totalCost: number = 0;
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  getTotalCost() {
    return this.totalCost;
  }

  setTotalCost(totalCost: number) {
    this.totalCost = totalCost;
    this.totalCostChanged.next(totalCost);
  }

  getCartItems() {
    if (this.cartItems) return this.cartItems.slice();
    return [];
  }

  addToCart(cartItem: CartItemModel) {
    return this.http.post<CartModel>(`${this.baseUrl}/carts/`, cartItem).pipe(
      catchError((errorRes) => this.handleError(errorRes)),
      tap((resData) => {
        console.log(resData);
        this.setCart(resData);
        this.setCartItems(resData.items);
        this.setTotalCost(resData.totalCost);
      })
    );
  }

  updateCartItem(cartItem: CartItemModel) {
    return this.http
      .put<CartModel>(
        `${this.baseUrl}/carts/${cartItem.cartId}/cartItems/${cartItem.id}/`,
        cartItem
      )
      .pipe(
        catchError((errorRes) => this.handleError(errorRes)),
        tap((resData) => {
          this.setCart(resData);
          this.setCartItems(resData.items);
          this.setTotalCost(resData.totalCost);
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
        this.setTotalCost(resData.totalCost);
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
          this.setTotalCost(resData.totalCost);
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

  removeFromCart(index: number, cartItem: CartItemModel) {
    let quantity = this.cartItems[index].quantity;
    let cost = this.cartItems[index].price;

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
          this.setCartItems(this.cart.items);
          this.setTotalCost(this.totalCost - quantity * cost);
        })
      );
  }

  checkout(cartItems: CartItemModel[]) {
    console.log(cartItems);

    return this.http
      .post<any>(
        `${environment.baseUrl}/orders/create-checkout-session`,
        cartItems
      )
      .pipe(
        catchError((errRes) => this.handleError(errRes)),
        tap((resData) => {
          console.log(resData);
        })
      );
  }

  handleError(errRes: any) {
    console.log(errRes);
    return throwError(() => new Error(errRes));
  }
}
