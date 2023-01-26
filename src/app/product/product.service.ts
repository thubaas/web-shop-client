import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ProductModel } from './product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  productsChanged = new Subject<ProductModel[]>();
  products: ProductModel[] = [];
  searchChanged = new Subject<ProductModel[]>();
  searchResults: ProductModel[] = [];

  constructor(private http: HttpClient) {}

  setProducts(products: ProductModel[]) {
    this.products = products;
    this.productsChanged.next(products.slice());
  }

  getProducts() {
    return this.products.slice();
  }

  getProduct(index: number) {
    return this.products[index];
  }

  searchProducts(name: string) {
    return this.http
      .get<ProductModel[]>(`${environment.baseUrl}/products/search/${name}`)
      .pipe(
        catchError((errorMes) => this.handleError(errorMes)),
        tap((resData) => {
          this.searchResults = resData;
          this.searchChanged.next(this.searchResults.slice());
        })
      );
  }

  addProduct(product: ProductModel) {
    return this.http
      .post<ProductModel>(`${environment.baseUrl}/products/`, product)
      .pipe(
        catchError((errorMes) => this.handleError(errorMes)),
        tap((resData) => this.productsChanged.next(this.products.slice()))
      );
  }

  updateProduct(index: number, product: ProductModel) {
    this.products[index] = product;
    return this.http
      .put<ProductModel>(
        `${environment.baseUrl}/products/${product.id}`,
        product
      )
      .pipe(
        catchError((errorMes) => this.handleError(errorMes)),
        tap((resData) => this.productsChanged.next(this.products.slice()))
      );
  }

  onProductsSuccess(products: ProductModel[]) {
    console.log(products);
    this.setProducts(products);
  }

  handleError(errorRes: any) {
    console.log(errorRes);
    let errorMes = 'An unkown error occurred';
    return throwError(() => new Error(errorMes));
  }
}
