import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { CategoryModel } from 'src/app/category/category.model';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { PlaceholderDirective } from 'src/app/shared/placeholder.directive';
import { ProductModel } from '../product.model';

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
  wishlistObservable: Observable<ApiResponse>;
  cartObservable: Observable<CategoryModel>;



  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.canEdit = this.router.url === '/admin/products';
  }

  showProductDetails() {
    console.log('Show product details');
    this.router.navigate([`${this.index}/edit`], { relativeTo: this.route });
  }

  onEdit() {
    console.log('Product : ', this.product);
    this.router.navigate([`${this.index}/edit`], { relativeTo: this.route });
  }

  onAddToWishList() {
    this.loading = true;
    const quantity = this.quantityInput.nativeElement.value;
    const product = this.productService.getProduct(this.id);
    this.wishlistObservable = this.wishlistService.addToWishlist(
      product,
      quantity
    );
    this.wishlistObservable.subscribe({
      next: (resData) => this.onSuccess(resData),
      error: (errorData) => this.onError(errorData),
    });
  }

  onAddToCart() {
    this.loading = true;
    const quantity = this.quantityInput.nativeElement.value;
    const product = this.productService.getProduct(this.id);
    this.cartObservable = this.cartService.addToCart(product.id!, quantity);
    this.cartObservable.subscribe({
      next: (resData) => this.onSuccess(resData),
      error: (errData) => this.onError(errData),
    });
  }

  onSuccess(resData: ApiResponse) {
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
