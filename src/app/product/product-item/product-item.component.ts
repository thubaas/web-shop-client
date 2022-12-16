import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { CartItemModel } from 'src/app/cart/cart-item/cart-item.model';
import { CartModel } from 'src/app/cart/cart.model';
import { CartService } from 'src/app/cart/cart.service';
import { CategoryModel } from 'src/app/category/category.model';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { PlaceholderDirective } from 'src/app/shared/placeholder.directive';
import { WishlistModel } from 'src/app/wishlist/wishlist.model';
import { WishlistService } from 'src/app/wishlist/wishlist.service';
import { ProductModel } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css'],
})
export class ProductItemComponent implements OnInit {
  @ViewChild('quantityRef', { static: false }) quantityInput: ElementRef;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
  private closeSubscription: Subscription;
  @Input() product: ProductModel;
  @Input() index: number;
  canEdit: boolean;
  success: boolean = false;
  loading: boolean;
  wishlistObservable: Observable<WishlistModel>;
  cartObservable: Observable<CartModel>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.canEdit = this.router.url === '/admin/products';
  }

  showProductDetails() {
    console.log('Show product details');
    this.router.navigate([`${this.index}`], { relativeTo: this.route });
  }

  onEdit() {
    console.log('Product : ', this.product);
    this.router.navigate([`${this.index}/edit`], { relativeTo: this.route });
  }

  onAddToWishList() {
    this.loading = true;
    const product = this.productService.getProduct(this.index);
    const wishlist: WishlistModel = { product };
    this.wishlistObservable = this.wishlistService.addToWishlist(product);
    this.wishlistObservable.subscribe({
      next: (resData) => this.onSuccess(resData),
      error: (errorData) => this.onError(errorData),
    });
  }

  onAddToCart() {
    this.loading = true;
    // const quantity = this.quantityInput.nativeElement.value;
    const product = this.productService.getProduct(this.index);

    let cartItem: CartItemModel = {
      quantity: 1,
      id: this.index,
      productId: product.id!,
      productName: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
    };

    this.cartObservable = this.cartService.addToCart(cartItem);
    this.cartObservable.subscribe({
      next: (resData) => this.onSuccess(resData),
      error: (errData) => this.onError(errData),
    });
  }

  onSuccess(resData: any) {
    this.success = true;
    this.loading = false;
    this.showAlert('Product Added', 'bi bi-check-circle text-success');
  }

  onError(errorMessage: string) {
    this.loading = false;
    this.showAlert(errorMessage, 'bi bi-exclamation-circle text-danger');
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
