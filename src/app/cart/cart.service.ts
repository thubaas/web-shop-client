import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Subject, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductModel } from '../product/product.model';
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
        console.log(resData);
      })
    );
  }

  fetchCart() {
    const userJSON = localStorage.getItem('user');
    let user;
    if (userJSON !== null) {
      user = JSON.parse(userJSON);
    }
    return this.http.get<CartModel>(`${this.baseUrl}/${user.id}/`).pipe(
      catchError((errorRes) => this.handleError(errorRes)),
      tap((resData) => {
        this.setCart(resData);
        this.setCartItems(resData.cartItems);
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
    return this.http
      .put<CartModel>(`${environment.baseUrl}/${cartItem.id}/`, cartItem)
      .pipe(
        catchError((errorRes) => this.handleError(errorRes)),
        tap((resData) => {
          this.cart.cartItems.slice(index, 1);
          console.log(resData);
        })
      );
  }

  handleError(errRes: any) {
    console.log(errRes);
    return throwError(() => new Error(errRes));
  }
}
