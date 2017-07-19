import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthHttp, tokenNotExpired, JwtHelper } from "angular2-jwt";

@Injectable()
export class AppAuthService {
  constructor(router: Router, authHttp: AuthHttp) {
    this.router = router;
    this.authHttp = authHttp;
    this.jwtHelper = new JwtHelper();
  }

  getMe() {
    return this.authHttp.get("v1/dashboard/me");
  }

  role() {
    let decoded;
    const token = localStorage.getItem(TOKEN_NAME, "guest");
    try {
      decoded = this.jwtHelper.decodeToken(token);
    } catch (e) {
      decoded = "guest";
    }
    return decoded.role;
  }

  isAdmin() {
    return this.role() === "admin";
  }

  isUser() {
    return this.role() === "user";
  }

  logout() {
    localStorage.removeItem(TOKEN_NAME);
    this.router.navigate(["/auth/login"]);
  }

  loggedIn() {
    return tokenNotExpired();
  }
}
