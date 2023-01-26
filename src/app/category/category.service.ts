import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CategoryModel } from './category.model';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  categories: CategoryModel[] = [];
  categoriesChanged = new Subject<CategoryModel[]>();
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  setCategories(categories: CategoryModel[]) {
    this.categories = categories;
    this.categoriesChanged.next(this.categories.slice());
  }

  addCategory(category: CategoryModel) {
    return this.http
      .post<CategoryModel>(`${this.baseUrl}/categories/`, category)
      .pipe(
        catchError((errorMes) => this.handleError(errorMes)),
        tap((resData) => this.categoriesChanged.next(this.categories.slice()))
      );
  }

  updateCategory(index: number, category: CategoryModel) {
    return this.http
      .put<CategoryModel>(`${this.baseUrl}/categories/${category.id}`, category)
      .pipe(
        catchError(this.handleError),
        tap((resData) => this.categoriesChanged.next(this.categories.slice()))
      );
  }

  getCategory(index: number): CategoryModel {
    return this.categories[index];
  }

  getCategoryById(categoryId: number) {
    return this.categories.find((category) => category.id === categoryId);
  }

  getCategoryByName(name: string) {
    return this.categories.find(
      (category) => category.name === name
    );
  }

  getCategories(): CategoryModel[] {
    return this.categories.slice();
  }

  onCategoriesSuccess(categories: CategoryModel[]) {
    console.log(categories);
    this.setCategories(categories);
  }

  handleError(errorRes: string) {
    console.log(errorRes);
    let errorMessage = 'An unkown error occured';
    return throwError(() => new Error(errorMessage));
  }
}
