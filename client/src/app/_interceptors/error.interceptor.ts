import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        //Check if error is non null
        if (error) {
          switch (error.status) {
            case 400:
              //Can have 2 sub cases--> 400 Bad Req from Validation failure
              //In above case, errors come back as [] nested as below
              if (error.error.errors) {
                const modelStateErrors = [];
                //loop over all errors & store in modelStateErrors[]
                for (const key in error.error.errors) {
                  if (error.error.errors[key]) {
                    //Build up all errors in this []
                    modelStateErrors.push(error.error.errors[key]);
                  }
                }
                throw modelStateErrors.flat();
              }
              //Regular Bad request
              else {
                this.toastr.error(error.error, error.status.toString());
              }
              break;
            case 401:
              this.toastr.error('UnAuthorised',error.status.toString() );
              break;
            case 404:
              this.router.navigateByUrl('/not-found');
              break;
            case 500:
              //Router can accept State, so we'll gather our server errors
              const navigationExtras : NavigationExtras ={ state:{error: error.error}};
              this.router.navigateByUrl('/server-error', navigationExtras);
              break;
            default:
              this.toastr.error('Something unexpected went wrong');
              console.log(error);
              break;

          }
        }
        throw error;
      })
    );
  }
}
