import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // 1. Get raw JWT token
    const token = this.authService.getRawJwtToken();

    // 2. Clone request and attach Authorization header if token exists
    let authReq = request;
    if (token) {
      authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // 3. Handle 401 Unauthorized (e.g. 15 days expired on backend)
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.warn('[JwtInterceptor] 401 Unauthorized received. Triggering auto-logout.');
          const message = error.error?.message || 'Your session has expired after 15 days. Please log in again.';
          this.authService.logout(message);
        }
        return throwError(() => error);
      })
    );
  }
}
