import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CategoryComponent } from './category.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryResolverService } from './category-resolver.service';
import { CategoryEditComponent } from './category-edit/category-edit.component';

const routes: Routes = [
  {
    path: '',
    component: CategoryComponent,
    canActivate: [],
    children: [
      {
        path: '',
        component: CategoryListComponent,
        resolve: [CategoryResolverService],
      },
      { path: 'new', component: CategoryEditComponent },
      { path: ':id/edit', component: CategoryEditComponent, resolve: [] },
    ],
  },
];

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoryRoutingModule {}
