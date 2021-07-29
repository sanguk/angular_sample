import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';

@Component({ templateUrl: 'admin.component.html' })
export class AdminComponent implements OnInit {
  loading = false;
  users: User[] = [];
  timeout: string;

  constructor(
    private userService: UserService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.userService.getAll().pipe(first()).subscribe(users => {
      this.loading = false;
      this.users = users;
    });

    this.getTimeoutOnClick();
  }

  getTimeoutOnClick() {
    console.log('this.authenticationService.tokenTimeOut', this.authenticationService.tokenTimeOut);
    this.timeout = this.authenticationService.tokenTimeOut;
  }

  refreshToken() {
    this.authenticationService.refreshTokenTimer();
  }
}
