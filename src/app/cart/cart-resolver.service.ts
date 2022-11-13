import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { CartModel } from './cart.model';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root',
})
export class CartResolverService implements Resolve<CartModel> {
  constructor(private cartService: CartService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): CartModel | Observable<CartModel> | Promise<CartModel> {
    let cart = this.cartService.getCart();
    if (cart === undefined) {
      return this.cartService.fetchCart();
    }
    return cart;
  }
}
