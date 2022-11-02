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
  categories: CategoryModel[] = [
    {
      name: 'Electronics',
      description: 'Portable electronic devices',
      imageUrl:
        'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1450&q=80',
      id: 1,
    },
    {
      name: 'Hoodies',
      description: 'Unisex special hoodies',
      imageUrl:
        'https://images.unsplash.com/photo-1622567893612-a5345baa5c9a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fGhvb2R5fGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60',
      id: 2,
    },
    {
      name: 'Sports Clothing',
      description: 'Sports and Fitness Clothing',
      imageUrl:
        'https://images.unsplash.com/photo-1516763562359-cae9ea43851f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80',
      id: 3,
    },
    {
      name: 'Stationery',
      description: 'Drawing set for kids',
      imageUrl:
        'https://images.unsplash.com/photo-1631173716529-fd1696a807b0?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c3RhdGlvbmVyeXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      id: 4,
    },
    {
      name: 'Household',
      description: 'Laundry equipment',
      imageUrl:
        'https://images.unsplash.com/photo-1574538298279-26973f60efa3?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8bGF1bmRyeSUyMG1hY2hpbmV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60',
      id: 5,
    },
    {
      name: 'Grocery',
      description: 'Family groceries',
      imageUrl:
        'https://images.unsplash.com/photo-1534723452862-4c874018d66d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8Z3JvY2VyeXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60',
      id: 6,
    },
  ];
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
    return (
      this.http
        .put<CategoryModel>(
          `${this.baseUrl}/categories/${category.id}`,
          category
        )
        .pipe(catchError(this.handleError)),
      tap((resData) => this.categoriesChanged.next(this.categories.slice()))
    );
  }

  getCategory(index: number): CategoryModel {
    return this.categories[index];
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
