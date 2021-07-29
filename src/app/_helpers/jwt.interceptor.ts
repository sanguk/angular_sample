import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '@environments/environment';
import { AuthenticationService } from '@app/_services';
import { tap } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add auth header with jwt if user is logged in and request is to the api url
    const user = this.authenticationService.userValue;
    //console.log('intercept user', user);
    const isLoggedIn = user && user.jwtToken;
    const isApiUrl = request.url.startsWith(environment.apiUrl);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${user.jwtToken}` }
      });
    }

    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse && (event.status === 200)) {
          if (request.url.includes('refresh-token')) {
            return;
          }

          const user = this.authenticationService.userValue;
          const isLoggedIn = user && user.jwtToken;
          const isApiUrl = request.url.startsWith(environment.apiUrl);
          if (isLoggedIn && isApiUrl) {
            const jwtToken = JSON.parse(atob(user.jwtToken.split('.')[1]));
            const expires = new Date(jwtToken.exp * 1000);
            const timeout = expires.getTime() - Date.now();
            if (timeout < (60 * 1000 * 15)) {
              console.log('JwtInterceptor refreshTokenTimer', timeout, (60 * 1000 * 15), request.url);
              this.authenticationService.refreshTokenTimer();
            } 
          }
        }
      })
    );
  }
}
