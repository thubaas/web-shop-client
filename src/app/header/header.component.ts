import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { UserModel } from '../auth/user.model';
import { ProductModel } from '../product/product.model';
import { ProductService } from '../product/product.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],

  host: {
    '(document:click)': 'onDismisSearch($event)',
  },
})
export class HeaderComponent implements OnInit {
  show: boolean = false;
  user: string = 'guest';
  searchObservable: Observable<ProductModel[]>;
  searchResults: ProductModel[] = [];
  @ViewChild('searchRef', { static: false }) searchInput: ElementRef;
  @ViewChild('resultsRef', { static: false }) resultsElem: ElementRef;

  constructor(
    private authService: AuthService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.authService.user.subscribe({
      next: (authData) => (this.user = authData?.username || 'guest'),
    });
  }

  onSearch() {
    let value = this.searchInput.nativeElement.value;
    this.searchObservable = this.productService.searchProducts(value);
    this.searchObservable.subscribe({
      next: (resData) => (this.searchResults = resData),
      error: (errMes) => console.log(errMes),
    });
  }

  onDismisSearch(event: Event) {
    if (
      this.resultsElem &&
      !this.resultsElem.nativeElement.contains(event.target)
    ) {
      this.searchResults = [];
      this.searchInput.nativeElement.value = '';
    }
  }
}
