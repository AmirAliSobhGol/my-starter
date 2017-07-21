import { Component } from "@angular/core";

import { ToggleService } from "core/sidebar/sidebar.service";

/*
 * This class represents the toggle component.
 */
@Component({
  selector: "club-toggle",
  template: `
    <button class='btn btn-primary' (click)="toggleSideBar()">
      <span class="fa fa-bars"></span>
    </button>
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
