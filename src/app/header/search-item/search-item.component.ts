import { Component, Input, OnInit } from '@angular/core';
import { ProductModel } from 'src/app/product/product.model';

@Component({
  selector: 'app-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.css']
})
export class SearchItemComponent implements OnInit {

  @Input() product: ProductModel
  @Input() index: number

  constructor() { }

  ngOnInit(): void {
  }

  onAddToCart() {}

  onAddtoWishlist(){}

}
