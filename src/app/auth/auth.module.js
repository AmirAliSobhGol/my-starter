import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { AuthRoutingModule } from "./auth-routing.module";

import { AppAuthService } from "./auth.service";

import { LoginComponent } from "./login/login.component";

@NgModule({
  imports: [ReactiveFormsModule, CommonModule, AuthRoutingModule],
  declarations: [LoginComponent],
  providers: [AppAuthService]
})
export class AuthModule {}
