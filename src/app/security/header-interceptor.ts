import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { NgxSpinnerService } from "ngx-spinner";

export const HeaderInterceptor: HttpInterceptorFn = (
  request: HttpRequest<any>,
  next: HttpHandlerFn

): Observable<HttpEvent<any>> => {

  const spinner = inject(NgxSpinnerService);

  spinner.show();
  let modifiedRequest = request;
  const token = localStorage.getItem('token');

  if(token) {
    modifiedRequest = request.clone({
      setHeaders: {
        'authorization': `Bearer ${token}`,
      }
    });
  }

  return next(modifiedRequest).pipe(
    finalize(() => spinner.hide())
  );
}