import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CartModel } from '../cart/cart.model';
import { CartService } from '../cart/cart.service';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';
import { WishlistModel } from './wishlist.model';
import { WishlistService } from './wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css'],
})
export class WishlistComponent implements OnInit, OnDestroy {
  private closeSubscription: Subscription;
  loading: boolean = false;
  wishlistObservable: Observable<WishlistModel>;
  cartObservable: Observable<CartModel>;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
  wishlists: WishlistModel[];

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.wishlists = this.wishlistService.getWishlists();
    this.wishlistService.wishlistChanged.subscribe({
      next: (items) => (this.wishlists = items),
      error: (err) => console.log(err),
    });
  }

  onMoveAllToCart() {
    this.loading = true;
    this.cartObservable = this.cartService.moveAllToCart(this.wishlists);
    this.cartObservable.subscribe({
      next: (resData) => this.onSuccess('Wishlist moved to cart'),
      error: (errRes) => this.onError(errRes),
    });
  }

  onSuccess(msg: string) {
    this.loading = false;
    this.showAlert(msg, 'bi bi-check-circle text-success');
  }

  onError(errorMessage: string) {
    this.loading = false;
    this.showAlert(errorMessage, 'bi bi-exclamation-circle text-danger');
  }

  showAlert(
    message: string,
    bsIconClass: string = 'bi bi-check-circle text-success'
  ) {
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(AlertComponent);

    componentRef.instance.message = message;
    componentRef.instance.iconClass = bsIconClass;
    this.closeSubscription = componentRef.instance.close.subscribe(() => {
      this.closeSubscription.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  ngOnDestroy(): void {
    if (this.closeSubscription) this.closeSubscription.unsubscribe();
  }
}
