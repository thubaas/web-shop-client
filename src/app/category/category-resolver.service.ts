import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { CategoryModel } from './category.model';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root',
})
export class CategoryResolverService implements Resolve<CategoryModel[]> {
  constructor(
    private categoryService: CategoryService,
    private dataStorageService: DataStorageService
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): CategoryModel[] | Observable<CategoryModel[]> | Promise<CategoryModel[]> {
    const categories = this.categoryService.getCategories();
    if (categories.length === 0) {
      return this.dataStorageService.fetchCategories();
    }
    return categories;
  }
}
