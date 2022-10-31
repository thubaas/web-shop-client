import { NgModule } from '@angular/core';
import { CategoryRoutingModule } from './category-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CategoryComponent } from './category.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryItemComponent } from './category-item/category-item.component';
import { CategoryEditComponent } from './category-edit/category-edit.component';

@NgModule({
  declarations: [
    CategoryComponent,
    CategoryListComponent,
    CategoryItemComponent,
    CategoryEditComponent,
  ],
  imports: [SharedModule, CategoryRoutingModule],
  exports: [CategoryItemComponent],
})
export class CategoryModule {}
