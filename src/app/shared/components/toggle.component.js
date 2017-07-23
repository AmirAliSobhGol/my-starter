import { Component } from "@angular/core";

import { ToggleService } from "core/sidebar/sidebar.service";

/*
 * This class represents the toggle component.
 */
@Component({
  selector: "sidebar-toggle",
  template: `
      <i class="fa fa-bars fa-lg clickable" (click)="toggleSideBar()"></i>
  `,
})
export class ToggleComponent {
  showSideBar = false;

  constructor(toggleService: ToggleService) {
    this.toggleService = toggleService;
  }

  toggleSideBar() {
    this.toggleService.toggleSidebar();
  }
}
