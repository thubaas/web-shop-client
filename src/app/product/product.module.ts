import { NgModule } from '@angular/core';
import { ProductComponent } from './product.component';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductListComponent } from './product-list/product-list.component';
import { SharedModule } from '../shared/shared.module';
import { ProductRoutingModule } from './product-routing.module';

@NgModule({
  declarations: [
    ProductComponent,
    ProductEditComponent,
    ProductItemComponent,
    ProductDetailsComponent,
    ProductListComponent,
  ],
  imports: [SharedModule, ProductRoutingModule],
  exports: [ProductItemComponent],
})
export class ProductModule {}
