import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { CartItemModel } from 'src/app/cart/cart-item/cart-item.model';
import { CartModel } from 'src/app/cart/cart.model';
import { CartService } from 'src/app/cart/cart.service';
import { CategoryModel } from 'src/app/category/category.model';
import { CategoryService } from 'src/app/category/category.service';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { PlaceholderDirective } from 'src/app/shared/placeholder.directive';
import { WishlistModel } from 'src/app/wishlist/wishlist.model';
import { WishlistService } from 'src/app/wishlist/wishlist.service';
import { ProductModel } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('quantityRef', { static: false }) quantityInput: ElementRef;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
  private closeSubscription: Subscription;
  product: ProductModel;
  id: number;
  category: CategoryModel;
  loading: boolean;
  total: number;
  wishlistObservable: Observable<WishlistModel>;
  cartObservable: Observable<CartModel>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.product = this.productService.getProduct(this.id);
      this.category = this.categoryService.getCategoryById(
        this.product.categoryId!
      )!;
      this.total = this.product.price;
    });
  }

  onAddToWishlist() {
    this.loading = true;
    this.wishlistObservable = this.wishlistService.addToWishlist(this.product);
    this.wishlistObservable.subscribe({
      next: (resData) => this.onSuccess(resData),
      error: (errorRes) => this.onError(errorRes),
    });
  }

  onAddToCart() {
    this.loading = true;
    let cartItem: CartItemModel = {
      id: this.id,
      productId: this.product.id!,
      productName: this.product.name,
      imageUrl: this.product.imageUrl,
      price: this.product.price,
      quantity: this.quantityInput.nativeElement.value,
    };

    this.cartObservable = this.cartService.addToCart(cartItem);
    this.cartObservable.subscribe({
      next: (resData) => this.onSuccess(resData),
      error: (errorRes) => this.onError(errorRes),
    });
  }

  onQuantityChange() {
    console.log('Quantity Changed : ', this.quantityInput.nativeElement.value);
    this.total = this.quantityInput.nativeElement.value * this.product.price;
  }

  onSuccess(resData: any) {
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
