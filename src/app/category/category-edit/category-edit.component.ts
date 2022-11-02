import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { PlaceholderDirective } from 'src/app/shared/placeholder.directive';
import { CategoryModel } from '../category.model';
import { CategoryService } from '../category.service';

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.css'],
})
export class CategoryEditComponent implements OnInit {
  categoryForm: FormGroup;
  formTitle: string;
  isEditMode: boolean = false;
  loading: boolean = false;
  success: boolean = false;
  id: number;

  targetCategory: CategoryModel;
  categoryObservable: Observable<CategoryModel>;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
  private closeSubscription: Subscription;

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.id = +params['id'];
      this.isEditMode = !isNaN(params['id']);
      console.log('EditMode : ', this.isEditMode);
      this.initForm();
    });
  }

  onSubmit() {
    let category = { ...this.categoryForm.value };
    this.loading = true;
    if (this.isEditMode) {
      category.id = this.targetCategory.id;
      this.categoryObservable = this.categoryService.updateCategory(
        this.id,
        category
      );
    } else {
      this.categoryObservable = this.categoryService.addCategory(category);
    }

    this.categoryObservable.subscribe({
      next: (resData) => this.onSuccess(resData),
      error: (errorMessage) => this.onError(errorMessage),
    });
  }

  onSuccess(resData: CategoryModel) {
    this.success = true;
    this.loading = false;
    this.categoryForm.reset();
    let msg = this.isEditMode
      ? 'Category updated successfully'
      : 'Category added successfully';
    this.showAlert(msg, 'bi bi-check-circle text-success');
  }

  onError(errorMessage: string) {
    this.loading = false;
    this.showAlert(errorMessage, 'bi bi-exclamation-circle text-danger');
  }

  private showAlert(
    message: string,
    bsIconClass: string = 'bi bi-check-circle'
  ) {
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(AlertComponent);

    componentRef.instance.message = message;
    componentRef.instance.iconClass = bsIconClass;
    this.closeSubscription = componentRef.instance.close.subscribe(() => {
      this.closeSubscription.unsubscribe();
      hostViewContainerRef.clear();
      if (this.success) {
        this.router.navigate(['admin/categories'], {
          relativeTo: this.route.root,
        });
      }
    });
  }

  onCancel() {
    this.categoryForm.reset();
  }

  initForm() {
    let name, description, imageUrl;

    this.formTitle = this.isEditMode ? 'Edit Category' : 'Add Category';
    if (this.isEditMode) {
      this.targetCategory = this.categoryService.getCategory(this.id);
      name = this.targetCategory.name;
      description = this.targetCategory.description;
      imageUrl = this.targetCategory.imageUrl;
    }

    this.categoryForm = new FormGroup({
      name: new FormControl(name, [
        Validators.required,
        Validators.minLength(3),
      ]),
      description: new FormControl(description, [
        Validators.required,
        Validators.minLength(3),
      ]),
      imageUrl: new FormControl(imageUrl, [
        Validators.required,
        Validators.minLength(3),
      ]),
    });
  }
}
