import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../_services';
import { User, Role } from '../_models';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  //styleUrls: ['./nav-menu.component.scss']
})


export class NavMenuComponent {
  // @ViewChild('sidenav', { static: true }) sidenav: SidenavComponent
  user: User;

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    //this.authenticationService.user.subscribe(x => this.currentUser = x);
    this.authenticationService.user.subscribe(x => this.user = x);
  }

  get isAdmin() {
    return this.user && this.user.role === Role.Admin;
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }
}
