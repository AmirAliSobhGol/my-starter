import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { AuthGuard } from "./core/auth/guards/auth-guard.service";
/*
 add app module routes here, e.g., to lazily load a module
 (do not place feature module routes here, use an own -routing.module.ts in the feature instead)
 */
const appRoutes = [
  {
    path: "auth",
    loadChildren: () =>
      System.import("./auth/auth.module").then(module => module.AuthModule),
    canLoad: [AuthGuard],
  },
  {
    path: "",
    redirectTo: "/auth/login",
    pathMatch: "full",
    canLoad: [AuthGuard],
  },
  { path: "**", redirectTo: "/auth/login" },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
