import { Component, OnInit } from '@angular/core';
import { WishlistModel } from './wishlist.model';
import { WishlistService } from './wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.css']
})
export class WishlistComponent implements OnInit {

  wishlists: WishlistModel[];

  constructor(private wishlistService: WishlistService) { }

  ngOnInit(): void {
    this.wishlists = this.wishlistService.getWishlists();
  }

}
