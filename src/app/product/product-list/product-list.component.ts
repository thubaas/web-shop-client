import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { ProductModel } from '../product.model';
import { ProductService } from '../product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: ProductModel[];
  role: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService, private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userData = this.authService.getAuthenticatedUser();
    if(userData !== null) {
      this.role = userData.role;
    }
    this.getProducts();
  }

  getProducts() {
    this.products = this.productService.getProducts();
  }

  onAddProduct() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
}
