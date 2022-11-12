import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { WishlistModel } from './wishlist.model';
import { WishlistService } from './wishlist.service';

@Injectable({
  providedIn: 'root',
})
export class WishlistResolverService implements Resolve<WishlistModel[]> {
  constructor(private wishlistService: WishlistService) {}
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): WishlistModel[] | Observable<WishlistModel[]> | Promise<WishlistModel[]> {
    const wishlists = this.wishlistService.getWishlists();
    if (wishlists.length === 0) {
      return this.wishlistService.fetchWishlists();
    }
    return wishlists;
  }
}
