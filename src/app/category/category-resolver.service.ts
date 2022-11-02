import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { CategoryModel } from './category.model';
import { CategoryService } from './category.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryResolverService implements Resolve<CategoryModel[]> {

  constructor(private categoryService: CategoryService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): CategoryModel[] | Observable<CategoryModel[]> | Promise<CategoryModel[]> {
    throw new Error('Method not implemented.');
  }
}
