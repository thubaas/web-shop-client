import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { PlaceholderDirective } from 'src/app/shared/placeholder.directive';
import { AuthService } from '../auth.service';
import { SigninRespModel } from './signin-resp.model';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit, OnDestroy {
  signinForm: FormGroup;
  loading: boolean = false;
  success: boolean = false;
  isAuthenticated: boolean;
  formTitle: string;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
  signinObservable: Observable<SigninRespModel>;
  private closeSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.formTitle = this.isAuthenticated ? 'Sign Out' : 'Sign In';
    this.initForm();
  }

  onSubmit() {
    this.loading = true;
    let signinData = { ...this.signinForm.value };
    this.signinObservable = this.authService.signin(signinData);
    this.signinObservable.subscribe({
      next: (resData) => this.onSuccess(resData),
      error: (errorMessage) => this.onError(errorMessage),
    });
  }

  onSignup() {
    this.router.navigate(['signup'], { relativeTo: this.route.parent });
  }

  onSignout() {
    console.log('Sign out');
    this.isAuthenticated = false;
    this.authService.signout();
  }

  onCancel() {
    this.signinForm.reset();
  }

  onSuccess(resData: SigninRespModel) {
    this.success = true;
    this.loading = false;
    this.signinForm.reset();
    this.showAlert(resData.status, 'bi bi-check-circle text-success');
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
        this.router.navigate([''], { relativeTo: this.route.parent });
      }
    });
  }

  initForm() {
    let email, password;
    this.signinForm = new FormGroup({
      email: new FormControl(email, [Validators.required, Validators.email]),
      password: new FormControl(password, [
        Validators.required,
        Validators.minLength(8),
      ]),
    });
  }

  ngOnDestroy(): void {
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
  }
}
