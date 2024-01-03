import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NotificationService } from '@fuse/components/notification/notification.service';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LJError } from './error.model';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private notification:NotificationService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const errorResponse = this.mapError(error);
        this.notification.danger(errorResponse.message)
        return throwError(() => errorResponse); // Use throwError creator function
      }),
    );
  }

  private mapError(error: HttpErrorResponse): LJError {
    return {
      error: error.error.error || 'Unknown Error',
      message: error.error.message || 'An error occurred',
      statusCode: error.status,
    };
  }
}

export const ErrorInterceptorsProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};
