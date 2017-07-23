import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { FormBuilder, Validators } from "@angular/forms";

import { AuthService } from "../auth.service";

@Component({
  templateUrl: "login.component.pug",
  styleUrls: ["../auth.module.scss"],
})
export class LoginComponent {
  constructor(
    authService: AuthService,
    router: Router,
    formBuilder: FormBuilder,
  ) {
    this.router = router;
    this.formBuilder = formBuilder;
    this.authService = authService;
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.email]],
      password: ["", [Validators.required]],
      remember: true,
    });
  }

  submit() {
    if (this.loginForm.valid) {
      this.showError = false;
      this.login = this.authService
        .login(this.loginForm.value)
        .subscribe(
          () => this.router.navigate(["/assessor"]),
          () => (this.showError = true),
        );
    }
  }
}
