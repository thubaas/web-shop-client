import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpParams,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authService.authToken.pipe(
      take(1),
      exhaustMap((token) => {
        console.log('TOKEN : ', token);
        if (!token) {
          return next.handle(request);
        }

        const modifiedReq = request.clone({
          params: new HttpParams().set('token', token),
        });
        return next.handle(modifiedReq);
      })
    );
  }
}
