import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CategoryService } from '../category/category.service';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private categoryService: CategoryService
  ) {}

  fetchCategories() {
    return this.http
      .get<CategoryModel[]>(`${environment.baseUrl}/categories/`)
      .pipe(
        tap((categories) =>
          this.categoryService.onCategoriesSuccess(categories)
        ),
        catchError((errorRes) => this.categoryService.handleError(errorMes))
      );
  }
}
