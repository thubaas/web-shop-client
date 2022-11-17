import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { CategoryModel } from 'src/app/category/category.model';
import { CategoryService } from 'src/app/category/category.service';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { PlaceholderDirective } from 'src/app/shared/placeholder.directive';
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
  success: boolean;
  loading: boolean;
  total: number;
  // wishlistObservable: Observable<WishlistModel>;
  // cartObservable: Observable<CartModel>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.product = this.productService.getProduct(this.id);
      this.category = this.categoryService.getCategoryById(
        this.product.categoryId!
      )!;
    });
  }

  onAddToWishlist() {}

  onAddToCart() {}

  onQuantityChange() {
    console.log('Quantity Changed : ', this.quantityInput.nativeElement.value);
    this.total = this.quantityInput.nativeElement.value * this.product.price;
  }

  onSuccess(resData: ProductModel) {
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
