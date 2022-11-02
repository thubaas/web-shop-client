import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { ProductModel } from './product.model';
import { ProductService } from './product.service';

@Injectable({
  providedIn: 'root',
})
export class ProductResolverService implements Resolve<ProductModel[]> {
  constructor(
    private dataStorageService: DataStorageService,
    private productService: ProductService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): ProductModel[] | Observable<ProductModel[]> | Promise<ProductModel[]> {
    const products = this.productService.getProducts();
    if (products.length === 0) {
      return this.dataStorageService.fetchProducts();
    }
    return products;
  }
}
