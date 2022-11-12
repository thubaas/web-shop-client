import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { CartItemModel } from 'src/app/cart/cart-item/cart-item.model';
import { CartModel } from 'src/app/cart/cart.model';
import { CartService } from 'src/app/cart/cart.service';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { PlaceholderDirective } from 'src/app/shared/placeholder.directive';
import { WishlistModel } from '../wishlist.model';
import { WishlistService } from '../wishlist.service';

@Component({
  selector: 'app-wishlist-item',
  templateUrl: './wishlist-item.component.html',
  styleUrls: ['./wishlist-item.component.css'],
})
export class WishlistItemComponent implements OnInit, OnDestroy {
  @Input() wishlist: WishlistModel;
  @Input() index: number;
  removeItemObservable: Observable<Boolean>;
  moveToCartObservable: Observable<CartModel>;
  loading: Boolean = false;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
  private closeSubscription: Subscription;

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {}

  onRemove() {
    this.loading = true;
    this.removeItemObservable = this.wishlistService.removeFromWishlist(
      this.index
    );
    this.removeItemObservable.subscribe({
      next: (resData) => this.onSuccess(resData),
      error: (errData) => this.onError(errData),
    });
  }

  onMoveToCart() {
    this.loading = true;
    let product = this.wishlist.product;
    let cartItem: CartItemModel = {
      quantity: 1,
      productId: product.id!,
      price: product.price,
      productName: product.name,
      imageUrl: product.imageUrl,
    };
    this.moveToCartObservable = this.cartService.addToCart(cartItem);
    this.moveToCartObservable.subscribe({
      next: (cart) => {
        this.loading = false;
        this.cartService.setCart(cart);
        this.wishlistService.updateList(this.index);
      },
      error: (errRes) => this.onError(errRes),
    });
  }

  onSuccess(resData: Boolean) {
    this.loading = false;
    // this.showAlert()
  }

  onError(errMes: string) {
    this.loading = false;
    this.showAlert(errMes, 'bi bi-exclamation-circle text-danger');
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
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
  }
}
