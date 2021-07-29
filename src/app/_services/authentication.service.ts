import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private userSubject: BehaviorSubject<User>;
  public user: Observable<User>;

  private isOpen:boolean = true;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User {
    return this.userSubject.value;
  }

  public get tokenTimeOut(): string {
    const jwtToken = JSON.parse(atob(this.userValue.jwtToken.split('.')[1]));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now();// - (60 * 1000);

    const numSec = timeout / 1000 / 60;
    return Math.floor(numSec) + 'm ' + Math.floor((numSec - Math.floor(numSec)) * 60) + "s";
  }

  login(username: string, password: string) {
    console.log('login: ' + environment.apiUrl);
    return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { username, password })
      .pipe(map(user => {
        // store user details and jwt token in local storage to keep user logged in between page refreshes
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('refreshToken', user.refreshToken);
        this.userSubject.next(user);
        return user;
      }));
  }

  logout() {
    console.log('refreshToken', this.userValue);
    //alert(this.userValue);

    let refreshToken: string = null;
    if (this.userValue != null) {
      refreshToken = this.userValue.refreshToken;
    }

    this.http.post<any>(`${environment.apiUrl}/users/revoke-token`, { token: refreshToken }, { withCredentials: true }).subscribe();

    localStorage.removeItem('user');

    this.stopRefreshTokenTimer();
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  refreshToken() {
    console.log('refreshToken');
   // debugger;
    let refreshToken: string = localStorage.getItem('refreshToken');
    //console.log('refreshToken', refreshToken);

    return this.http.post<any>(`${environment.apiUrl}/users/refresh-token`, { token: refreshToken }, { withCredentials: true })
      .pipe(map((user) => {
        console.log('refreshToken pipe', user);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('refreshToken', user.refreshToken);
        this.userSubject.next(user);
        //this.startRefreshTokenTimer();

        this.isOpen = true;

        return user;
      }));
  }
  
  public refreshTokenTimer() {
    if (this.isOpen) {
      this.isOpen = false;
      setTimeout(() => this.refreshToken().subscribe(), 0);
    }
  }

  // helper methods
  private refreshTokenTimeout;

  private startRefreshTokenTimer() {
    console.log('startRefreshTokenTimer');
    //debugger;
    // parse json object from base64 encoded jwt token
    const jwtToken = JSON.parse(atob(this.userValue.jwtToken.split('.')[1]));

    // set a timeout to refresh the token a minute before it expires
    const expires = new Date(jwtToken.exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => this.refreshToken().subscribe(), timeout);
  }

  private stopRefreshTokenTimer() {
    console.log('stopRefreshTokenTimer');
    //debugger;
    clearTimeout(this.refreshTokenTimeout);
  }
}
