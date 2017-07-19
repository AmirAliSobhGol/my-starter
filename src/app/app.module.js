import { BrowserModule } from "@angular/platform-browser";
import { NgModule, ApplicationRef } from "@angular/core";
import {
  removeNgStyles,
  createNewHosts,
  createInputTransfer
} from "@angularclass/hmr";

/*
 * Platform and Environment providers/directives/pipes
 */
import { ENV_PROVIDERS } from "./environment";

// App is our top level component
import { AppComponent } from "./app.component";

import { CoreModule } from "./core/core.module";

import { AppRoutingModule } from "./app-routing.module";

import "../styles/styles.scss";

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [AppComponent],
  declarations: [AppComponent],
  /**
   * Import Angular's modules.
   */
  imports: [BrowserModule, AppRoutingModule, CoreModule.forRoot({})],
  /**
   * Expose our Services and Providers into Angular's dependency injection.
   */
  providers: [ENV_PROVIDERS]
})
export class AppModule {
  constructor(appRef: ApplicationRef) {
    this.appRef = appRef;
  }

  hmrOnInit(store) {
    if (!store || !store.state) {
      return;
    }

    /**
     * Set input values
     */
    if ("restoreInputValues" in store) {
      const restoreInputValues = store.restoreInputValues;
      setTimeout(restoreInputValues);
    }

    this.appRef.tick();
    delete store.state;
    delete store.restoreInputValues;
  }

  hmrOnDestroy(store) {
    const cmpLocation = this.appRef.components.map(
      cmp => cmp.location.nativeElement
    );

    /**
     * Recreate root elements
     */
    store.disposeOldHosts = createNewHosts(cmpLocation);
    /**
     * Save input values
     */
    store.restoreInputValues = createInputTransfer();
    /**
     * Remove styles
     */
    removeNgStyles();
  }

  hmrAfterDestroy(store) {
    /**
     * Display new elements
     */
    store.disposeOldHosts();
    delete store.disposeOldHosts;
  }
}
