import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { PlaceholderDirective } from 'src/app/shared/placeholder.directive';
import { AuthService } from '../auth.service';
import { SignupRespModel } from './signup-resp.model';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit, OnDestroy {
  signupForm: FormGroup;
  loading: boolean = false;
  success: boolean = false;
  roleValues: string[] = ['USER', 'ADMIN'];
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
  signupObsevable: Observable<SignupRespModel>;
  private closeSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit() {
    this.loading = true;
    let signupData = { ...this.signupForm.value };
    this.signupObsevable = this.authService.signup(signupData);
    this.signupObsevable.subscribe({
      next: (resData) => this.onSuccess(resData),
      error: (errorMessage) => this.onError(errorMessage),
    });
  }

  onSuccess(resData: SignupRespModel) {
    this.success = true;
    this.loading = false;
    this.signupForm.reset();
    this.showAlert(resData.message, 'bi bi-check-circle text-success');
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
        this.router.navigate(['signin'], { relativeTo: this.route.parent });
      }
    });
  }

  onCancel() {
    this.signupForm.reset();
  }

  initForm() {
    let email, firstname, lastname, password, passwordConfirmation;

    this.signupForm = new FormGroup({
      email: new FormControl(email, [Validators.required, Validators.email]),
      firstname: new FormControl(firstname, [
        Validators.required,
        Validators.minLength(3),
      ]),
      lastname: new FormControl(lastname, [
        Validators.required,
        Validators.minLength(3),
      ]),
      password: new FormControl(password, [
        Validators.required,
        Validators.minLength(8),
      ]),
      passwordConfirmation: new FormControl(passwordConfirmation, [
        Validators.required,
        Validators.minLength(8),
      ]),
      role: new FormControl(this.roleValues[0])
    });
  }

  ngOnDestroy(): void {
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
  }
}
