import { Component } from "@angular/core";
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from "@angular/router";
import { SlimLoadingBarService } from "ng2-slim-loading-bar";

/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: "app",
  template: `
    <ng2-slim-loading-bar></ng2-slim-loading-bar>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
})
export class AppComponent {
  constructor(router: Router, slimLoader: SlimLoadingBarService) {
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
  }
}
