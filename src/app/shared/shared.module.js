import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { NgxErrorsModule } from "@ultimate/ngxerrors";
import { BusyModule } from "angular2-busy";

import { SubmitButtonComponent } from "./components/submit-button.component";
import { ToggleComponent } from "./components/toggle.component";
import { TruncatePipe } from "./pipes/truncate.pipe";
import { Directives } from "./directives/index";

/**
 * Shared directives/pipes/components are defined here.
 *
 * CommonsModule and ReactiveFormsModule are exported because many module that import
 * the shared module also take advantage of features such as
 * NgIf and NgFor directives in CommonsModule and formBuilder in ReactiveFormsModule
 *
 * Note: Do NOT specify app-wide singleton providers in the shared module.
 * A lazy loaded module that imports that shared module will make its own copy of the service.
 */
@NgModule({
  declarations: [
    ToggleComponent,
    SubmitButtonComponent,
    TruncatePipe,
    Directives,
  ],
  imports: [CommonModule],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    NgxErrorsModule,
    BusyModule,
    SubmitButtonComponent,
    ToggleComponent,
    TruncatePipe,
    Directives,
  ],
})
export class SharedModule {}
