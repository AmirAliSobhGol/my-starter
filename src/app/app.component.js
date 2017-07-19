import { Component } from "@angular/core";

/**
 * App Component
 * Top Level Component
 */
@Component({
  selector: "app",
  template: `
    <main>
      <h1>Test</h1>
      <router-outlet></router-outlet>
    </main>
  `
})
export class AppComponent {}
