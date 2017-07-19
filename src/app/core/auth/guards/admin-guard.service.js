import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AppAuthService } from "../auth.service";

@Injectable()
export class AdminGuard {
  constructor(auth: AppAuthService, router: Router) {
    this.auth = auth;
    this.router = router;
  }

  canLoad() {
    return this.auth.isAdmin();
  }

  canActivate() {
    return this.auth.isAdmin();
  }
}
