import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ManagementComponent } from "./management/management.component";
import { AssessorListResolver } from "./management/listing-resolver.service";

const assessorRoutes: Routes = [
  {
    path: "",
    component: ManagementComponent,
    resolve: { assessors: AssessorListResolver },
  },
];

@NgModule({
  imports: [RouterModule.forChild(assessorRoutes)],
  exports: [RouterModule],
})
export class AssessorRoutingModule {}
