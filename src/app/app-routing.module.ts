import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { CartResolverService } from './cart/cart-resolver.service';
import { CartComponent } from './cart/cart.component';
import { CategoryResolverService } from './category/category-resolver.service';
import { HomeComponent } from './home/home.component';
import { PaymentComponent } from './payment/payment.component';
import { ProductResolverService } from './product/product-resolver.service';
import { WishlistResolverService } from './wishlist/wishlist-resolver.service';
import { WishlistComponent } from './wishlist/wishlist.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    resolve: [CategoryResolverService, ProductResolverService],
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./product/product.module').then((m) => m.ProductModule),
  },
  {
    path: 'categories',
    loadChildren: () =>
      import('./category/category.module').then((m) => m.CategoryModule),
  },
  {
    path: 'cart',
    component: CartComponent,
    resolve: [CartResolverService],
  },
  {
    path: 'wishlist',
    component: WishlistComponent,
    resolve: [WishlistResolverService],
  },
  {
    path: 'checkout',
    component: PaymentComponent,
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
