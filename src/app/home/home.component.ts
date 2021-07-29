import { Component } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService, AuthenticationService } from '@app/_services';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
  loading = false;
  //users: User[];
  user: User;
  timeout: string;

  constructor(
    //private userService: UserService,
    private authenticationService: AuthenticationService
  ) {
    this.user = this.authenticationService.userValue;
    console.log(this.user);

    this.getTimeoutOnClick();
  }

  ngOnInit() {
    this.loading = true;
    //this.userService.getAll().pipe(first()).subscribe(users => {
    //  this.loading = false;
    //  this.users = users;
    //});
  }

  getTimeoutOnClick() {
    console.log('this.authenticationService.tokenTimeOut', this.authenticationService.tokenTimeOut);
    this.timeout = this.authenticationService.tokenTimeOut;
  }

  refreshToken() {
    this.authenticationService.refreshTokenTimer();
  }
}
