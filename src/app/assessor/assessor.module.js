import { NgModule } from "@angular/core";

import { SharedModule } from "../shared/shared.module";
import { AssessorRoutingModule } from "./assessor-routing.module";
import { AssessorService } from "./assessor.service";
import { AssessorListResolver } from "./management/listing-resolver.service";
import { ManagementComponent } from "./management/management.component";

@NgModule({
  imports: [SharedModule, AssessorRoutingModule],
  declarations: [ManagementComponent],
  providers: [AssessorService, AssessorListResolver],
})
export class AssessorModule {}
