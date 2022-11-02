import { Component, OnInit } from '@angular/core';
import { CategoryModel } from '../category/category.model';
import { CategoryService } from '../category/category.service';
import { ProductModel } from '../product/product.model';
import { ProductService } from '../product/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  categories: CategoryModel[];
  products: ProductModel[];
  categorySize: number = 0;
  productSize: number = 0;

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.categories = this.categoryService.getCategories();
    this.products = this.productService.getProducts();
    this.categorySize = Math.min(6, this.categories.length);
    this.productSize = Math.min(8, this.products.length);
  }
}
