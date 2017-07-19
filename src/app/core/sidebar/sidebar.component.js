import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';
import { JwtHelper } from 'angular2-jwt';

import { ToggleService } from './sidebar.service';
import { AppAuthService } from '../auth/auth.service';

/*
 * This class represents the side bar component.
 */
@Component({
  selector: 'app-sidebar',
  styleUrls: ['sidebar.component.scss'],
  templateUrl: 'sidebar.component.pug',
})
export class SidebarComponent {
  showSideBar = false;
  toggleSideBar = window.screen.width > 768;

  constructor(
    router: Router,
    toggleService: ToggleService,
    appAuthService: AppAuthService,
  ) {
    this.appAuthService = appAuthService;
    this.router = router;
    this.jwtHelper = new JwtHelper();
    /*
     * We are subscribing to route events in order to decide
     * if we want to show the sidebar or not
     */
    router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event) => {
        this.showSideBar =
          !event.urlAfterRedirects.includes('auth') &&
          !event.urlAfterRedirects.includes('notFound');
      });

    toggleService.toggle.subscribe(
      () => (this.toggleSideBar = !this.toggleSideBar),
    );
  }

  logout() {
    this.appAuthService.logout();
    return false;
  }
}
