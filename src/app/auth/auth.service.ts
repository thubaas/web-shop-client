import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SigninRespModel } from './signin/signin-resp.model';
import { SigninModel } from './signin/signin.model';
import { SignupRespModel } from './signup/signup-resp.model';
import { SignupModel } from './signup/signup.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authToken = new BehaviorSubject<string | null>(null);

  constructor(private http: HttpClient) {}

  signup(signupData: SignupModel) {
    return this.http
      .post<SignupRespModel>(`${environment.baseUrl}/users/signup`, signupData)
      .pipe(
        catchError(this.handleError),
        tap((resData) => console.log(resData))
      );
  }

  signin(signinData: SigninModel) {
    return this.http
      .post<SigninRespModel>(`${environment.baseUrl}/users/signin`, signinData)
      .pipe(
        catchError(this.handleError),
        tap((resData) => {
          console.log(resData);
          this.handleAuth(resData);
        })
      );
  }

  autoSignin() {
    let token = localStorage.getItem('authToken');
    if (token !== null) {
      this.authToken.next(token);
    }
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('authToken') !== null;
  }

  signout() {
    localStorage.removeItem('authToken');
    this.authToken.next(null);
  }

  private handleAuth(signinRes: SigninRespModel) {
    let token = signinRes.token;
    localStorage.setItem('authToken', token);
    this.authToken.next(token);
  }

  private handleError(errorRes: HttpErrorResponse) {
    console.log(errorRes);
    return throwError(() => new Error(errorRes.error.error));
  }
}
