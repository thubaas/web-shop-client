import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert/alert.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { PlaceholderDirective } from './placeholder.directive';
import { DialogComponent } from './dialog/dialog.component';

@NgModule({
  declarations: [AlertComponent, LoadingSpinnerComponent, PlaceholderDirective, DialogComponent],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  exports: [
    AlertComponent,
    CommonModule,
    HttpClientModule,
    LoadingSpinnerComponent,
    PlaceholderDirective,
    ReactiveFormsModule,
  ],
})
export class SharedModule {}
