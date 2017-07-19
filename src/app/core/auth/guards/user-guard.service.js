import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AppAuthService } from "../auth.service";

@Injectable()
export class UserGuard {
  constructor(auth: AppAuthService, router: Router) {
    this.auth = auth;
    this.router = router;
  }

  canLoad() {
    return this.handle();
  }

  canActivate() {
    return this.handle();
  }

  handle() {
    if (this.auth.isUser()) {
      return true;
    }
    this.router.navigate(["/home"]);
    return false;
  }
}
