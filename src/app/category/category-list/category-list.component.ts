import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { CategoryModel } from '../category.model';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
})
export class CategoryListComponent implements OnInit {
  categories: CategoryModel[];
  role: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.role = this.authService.getAuthenticatedUser().role;
    this.getCategories();
  }

  getCategories() {
    this.categories = this.categoryService.getCategories();
  }

  onAddCategory() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
