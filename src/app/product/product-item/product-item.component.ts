import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductModel } from '../product.model';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css'],
})
export class ProductItemComponent implements OnInit {
  @Input() product: ProductModel;
  @Input() index: number;
  canEdit: boolean;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.canEdit = this.router.url === '/admin/products';
  }

  showProductDetails() {
    console.log('Show product details');
    this.router.navigate([`${this.index}/edit`], { relativeTo: this.route });
  }

  onEdit() {
    console.log('Product : ', this.product);
    this.router.navigate([`${this.index}/edit`], { relativeTo: this.route });
  }
}
