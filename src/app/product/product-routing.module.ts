import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './product.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductResolverService } from './product-resolver.service';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  {
    path: '',
    component: ProductComponent,
    canActivate: [],
    children: [
      {
        path: '',
        component: ProductListComponent,
        resolve: [ProductResolverService],
      },
      {
        path: 'new',
        component: ProductEditComponent,
      },
      {
        path: ':id',
        component: ProductDetailsComponent,
      },
      {
        path: ':id/edit',
        component: ProductEditComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductRoutingModule {}
