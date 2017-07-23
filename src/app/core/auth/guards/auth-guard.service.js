import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AppAuthService } from "../auth.service";

@Injectable()
export class AuthGuard {
  constructor(auth: AppAuthService, router: Router) {
    this.auth = auth;
    this.router = router;
  }

  canLoad() {
    if (this.auth.loggedIn()) {
      this.router.navigate(["/assessor"]);
      return false;
    }
    return true;
  }
}
