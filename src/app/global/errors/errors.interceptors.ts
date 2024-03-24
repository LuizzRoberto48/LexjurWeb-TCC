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
  constructor(private notification: NotificationService) {}
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    return next
      .handle(request)
      .pipe(catchError((error: HttpErrorResponse) => this.handleError(error)));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (
      error.error instanceof Blob &&
      error.error.type === 'application/json'
    ) {
      this.blobError(error.error);
    } else {
      this.standardError(error);
    }
    return throwError(() => error);
  }

  private blobError(blob: Blob): void {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const errorData = JSON.parse(reader.result as string);
        console.log(errorData);
        this.notification.danger(
          errorData.message ||
            'Um erro desconhecido ocorreu. Contacte nosso suporte',
        );
      } catch {
        this.notification.danger('Erro na resposta com o servidor');
      }
    };
    reader.onerror = () =>
      this.notification.danger('Erro na resposta com o servidor');
    reader.readAsText(blob);
  }

  private standardError(error: HttpErrorResponse): void {
    const errorMessage = error?.error?.message || error.message || 'Ocorreu um erro desconhecido';
    this.notification.danger(errorMessage);
  }
}

export const ErrorInterceptorsProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: ErrorInterceptor,
  multi: true,
};
