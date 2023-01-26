import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { CartItemModel } from 'src/app/cart/cart-item/cart-item.model';
import { CartModel } from 'src/app/cart/cart.model';
import { CartService } from 'src/app/cart/cart.service';
import { ProductModel } from 'src/app/product/product.model';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { PlaceholderDirective } from 'src/app/shared/placeholder.directive';
import { WishlistModel } from 'src/app/wishlist/wishlist.model';
import { WishlistService } from 'src/app/wishlist/wishlist.service';

@Component({
  selector: 'app-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.css'],
})
export class SearchItemComponent implements OnInit {
  cartObservable: Observable<CartModel>;
  wishlistObservable: Observable<WishlistModel>;
  loading = false;

  @Input() product: ProductModel;
  @Input() index: number;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
  private closeSubscription: Subscription;


  constructor(
    private cartSerVice: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {}

  onAddToCart() {
    this.loading = true;
    let cartItem: CartItemModel = {
      quantity: 1,
      id: this.index,
      productId: this.product.id!,
      productName: this.product.name,
      imageUrl: this.product.imageUrl,
      price: this.product.price,
    };

    this.cartObservable = this.cartSerVice.addToCart(cartItem);
    this.cartObservable.subscribe({
      next: (resData) => {
        console.log(resData);
        this.loading = false;
        this.showAlert('Added to cart', 'bi bi-check-circle text-success')

      },
      error: (errRes) => {
        console.log(errRes);
        this.loading = false;
        this.showAlert('Something Wrong', 'bi bi-exclamation-circle text-danger')
      },
    });
  }

  onAddtoWishlist() {
    this.loading = true;
    this.wishlistObservable = this.wishlistService.addToWishlist(this.product);
    this.wishlistObservable.subscribe({
      next: (resData) => {
        this.loading = false;
        console.log(resData);
        this.showAlert('Added to wishlist', 'bi bi-check-circle text-success')
      },
      error: (errMes) => {
        this.loading = false;
        console.log(errMes);
        this.showAlert('Something Wrong', 'bi bi-exclamation-circle text-danger')
      },
    });
  }

  showAlert(message: string, bsIconClass: string) {
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
