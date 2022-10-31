import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { AppRoutingModule } from './app-routing.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './product/product.module';
import { CartModule } from './cart/cart.module';
import { WishlistComponent } from './wishlist/wishlist.component';

@NgModule({
  declarations: [AppComponent, HeaderComponent, FooterComponent, WishlistComponent],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CategoryModule,
    CartModule,
    FormsModule,
    ProductModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
