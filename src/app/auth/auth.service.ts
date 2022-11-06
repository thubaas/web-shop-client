import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SigninRespModel } from './signin/signin-resp.model';
import { SigninModel } from './signin/signin.model';
import { SignupRespModel } from './signup/signup-resp.model';
import { SignupModel } from './signup/signup.model';
import { UserModel } from './user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<UserModel | null>(null);

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
    let userJSON = localStorage.getItem('user');
    if (userJSON !== null) {
      let userData = JSON.parse(userJSON);
      this.user.next(userData.token);
    }
  }

  isAuthenticated(): boolean {
    return localStorage.getItem('user') !== null;
  }

  signout() {
    localStorage.removeItem('user');
    this.user.next(null);
  }

  private handleAuth(signinRes: SigninRespModel) {
    let userData: UserModel = {'token': signinRes.token, 'id': signinRes.id};
    let userJSON = JSON.stringify(userData);
    localStorage.setItem('user', userJSON);
    this.user.next(userData);
  }

  private handleError(errorRes: HttpErrorResponse) {
    console.log(errorRes);
    return throwError(() => new Error(errorRes.error.error));
  }
}
