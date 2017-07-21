import { AuthHttp } from "angular2-jwt";
import { RouterModule } from "@angular/router";
/* eslint-disable no-unused-vars */
import { NgModule, Optional, SkipSelf } from "@angular/core";
/* eslint-enable no-unused-vars */
import { HttpModule, Http, RequestOptions } from "@angular/http";

import { SharedModule } from "../shared/shared.module";

import {
  AppAuthService,
  AuthGuard,
  LoggedOutGuard,
  authHttpServiceFactory,
  SidebarComponent,
  ToggleService,
  UserGuard,
  AdminGuard,
} from "./index";

/**
 * Single-use components (e.g., spinners, message toasts, and modal dialogs)
 * that We don't import them elsewhere so they're not shared in that sense.
 * are defined in this module
 */
@NgModule({
  imports: [SharedModule, HttpModule, RouterModule],
  declarations: [SidebarComponent],
  exports: [SidebarComponent],
})
export class CoreModule {
  constructor(
    @Optional()
    @SkipSelf()
    parentModule: CoreModule,
  ) {
    if (parentModule) {
      throw new Error(
        "CoreModule is already loaded. Import it in the AppModule only",
      );
    }
  }

  /**
   * a facility for configuring providers.
   *
   * the method both provides and configures services at the same time.
   * @returns {{ngModule: CoreModule, providers: Array}}
   */
  static forRoot() {
    return {
      ngModule: CoreModule,
      providers: [
        {
          provide: AuthHttp,
          useFactory: authHttpServiceFactory,
          deps: [Http, RequestOptions],
        },
        AuthGuard,
        AppAuthService,
        LoggedOutGuard,
        ToggleService,
        UserGuard,
        AdminGuard,
      ],
    };
  }
}
