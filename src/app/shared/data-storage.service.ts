import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CategoryModel } from '../category/category.model';
import { CategoryService } from '../category/category.service';
import { ProductModel } from '../product/product.model';
import { ProductService } from '../product/product.service';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  fetchCategories() {
    return this.http
      .get<CategoryModel[]>(`${environment.baseUrl}/categories/`)
      .pipe(
        tap((categories) =>
          this.categoryService.onCategoriesSuccess(categories)
        ),
        catchError((errorMes) => this.categoryService.handleError(errorMes))
      );
  }

  fetchProducts() {
    return this.http
      .get<ProductModel[]>(`${environment.baseUrl}/products/`)
      .pipe(
        tap((products) => this.productService.onProductsSuccess(products)),
        catchError((errMes) => this.productService.handleError(errMes))
      );
  }
}
