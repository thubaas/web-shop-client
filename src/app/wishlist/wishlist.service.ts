import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Subject, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ProductModel } from '../product/product.model';
import { WishlistModel } from './wishlist.model';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  wishlistChanged = new Subject<WishlistModel[]>();
  wishlists: WishlistModel[] = [];

  constructor(private http: HttpClient) {}

  setWishlists(wishlists: WishlistModel[]) {
    this.wishlists = wishlists;
    this.wishlistChanged.next(this.wishlists.slice());
  }

  getWishlists() {
    return this.wishlists.slice();
  }

  updateList(index: number) {
    this.wishlists.splice(index, 1);
    this.wishlistChanged.next(this.wishlists.slice());
  }

  fetchWishlists() {
    return this.http
      .get<WishlistModel[]>(`${environment.baseUrl}/wishlists/`)
      .pipe(
        catchError((errorRes) => this.handleError(errorRes)),
        tap((resData) => this.onSuccess(resData))
      );
  }

  addToWishlist(product: ProductModel) {
    return this.http
      .post<WishlistModel>(
        `
    ${environment.baseUrl}/wishlists/`,
        product
      )
      .pipe(
        catchError((errRes) => this.handleError(errRes)),
        tap((resData) => {
          console.log(resData);
          this.wishlists.push(resData);
          this.wishlistChanged.next(this.wishlists.slice());
        })
      );
  }

  removeFromWishlist(index: number) {
    let targetWishlist = this.wishlists[index];
    return this.http
      .delete<Boolean>(`${environment.baseUrl}/${targetWishlist.id}`)
      .pipe(
        catchError((errRes) => this.handleError(errRes)),
        tap((resData) => {
          if (resData) {
            this.wishlists.splice(index, 1);
            this.wishlistChanged.next(this.wishlists.slice());
          }
        })
      );
  }

  onSuccess(wishlists: WishlistModel[]) {
    console.log(wishlists);
    this.setWishlists(wishlists);
  }

  handleError(errorRes: any) {
    console.log(errorRes);
    let errorMessage = 'An unkown error occurred';
    return throwError(() => new Error(errorMessage));
  }
}
