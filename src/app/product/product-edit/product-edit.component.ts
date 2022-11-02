import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { CategoryService } from 'src/app/category/category.service';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { PlaceholderDirective } from 'src/app/shared/placeholder.directive';
import { ProductModel } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css'],
})
export class ProductEditComponent implements OnInit, OnDestroy {
  productForm: FormGroup;
  categoryValues: string[];
  targetProduct: ProductModel;
  isEditMode: boolean;
  success: boolean = false;
  id: number;
  formTitle: string;
  loading: boolean;
  productObservable: Observable<ProductModel>;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
  private closeSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.isEditMode = params['id'] != null;
      this.initForm();
    });
  }

  onSubmit() {
    let product = { ...this.productForm.value };

    let categoryValue = this.productForm.value.category;
    const categoryId =
      this.categoryService.getCategoryByName(categoryValue)?.id;
    product.categoryId = categoryId;

    this.loading = true;
    if (this.isEditMode) {
      product.id = this.targetProduct.id;
      this.productObservable = this.productService.updateProduct(
        this.id,
        product
      );
    } else {
      this.productObservable = this.productService.addProduct(product);
    }

    this.productObservable.subscribe({
      next: (resData) => this.onSuccess(resData),
      error: (errorRes) => this.onError(errorRes),
    });
  }

  onCancel() {
    this.productForm.reset();
  }

  onSuccess(resData: ProductModel) {
    this.success = true;
    this.loading = false;
    this.productForm.reset();
    this.showAlert('Product Added', 'bi bi-check-circle text-success');
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
      if (this.success) {
        this.router.navigate(['admin/products'], {
          relativeTo: this.route.root,
        });
      }
    });
  }

  initForm() {
    let category, name, description, imageUrl, price, id;

    this.categoryValues = this.categoryService
      .getCategories()
      .map((category) => category.name);

    this.formTitle = this.isEditMode ? 'Edit Product' : 'Add Product';

    if (this.isEditMode) {
      this.targetProduct = this.productService.getProduct(this.id);
      name = this.targetProduct.name;
      description = this.targetProduct.description;
      imageUrl = this.targetProduct.imageUrl;
      price = this.targetProduct.price;
      id = this.targetProduct.id;
    }

    this.productForm = new FormGroup({
      category: new FormControl(this.categoryValues[0]),
      name: new FormControl(name, [
        Validators.required,
        Validators.minLength(3),
      ]),
      description: new FormControl(description, [
        Validators.required,
        Validators.minLength(3),
      ]),
      imageUrl: new FormControl(imageUrl, [
        Validators.required,
        Validators.minLength(3),
      ]),
      price: new FormControl(price, [
        Validators.required,
        Validators.min(0.01),
      ]),
    });
  }

  ngOnDestroy(): void {
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
  }
}
