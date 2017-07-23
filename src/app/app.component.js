import { Component } from "@angular/core";
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from "@angular/router";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";
import { AuthHttp } from "angular2-jwt";
import { ToastrService } from "ngx-toastr";

/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: "app",
  template: `
    <main>
      <ng2-slim-loading-bar></ng2-slim-loading-bar>
      <app-sidebar> 
        <router-outlet></router-outlet>
      </app-sidebar> 
    </main>
  `,
})
export class AppComponent {
  constructor(
    router: Router,
    slimLoader: SlimLoadingBarService,
    http: AuthHttp,
    toastService: ToastrService,
  ) {
    /*
     * We are subscribing to route events in order to start/finish slim bar loading
     */
    router.events.subscribe(event => {
      slimLoader.interval = 50;
      switch (event.constructor) {
        case NavigationStart:
          slimLoader.reset();
          slimLoader.start();
          break;
        case NavigationCancel:
        case NavigationEnd:
        case NavigationError:
          slimLoader.complete();
          break;
        default:
          break;
      }
    });

    // Subscribe to http error events in order to show notifications
    http.errors.subscribe(error => {
      switch (error.status) {
        case 0:
          toastService.error(
            "Check your internet connection",
            "Network Error!",
          );
          break;
        default:
          toastService.error("Something went wrong!");
      }
    });
  }
}
