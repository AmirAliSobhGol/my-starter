import { Injectable } from "@angular/core";
import { AuthHttp } from "angular2-jwt";
import { URLSearchParams } from "@angular/http";
import _ from "lodash";

@Injectable()
export class AssessorService {
  constructor(authHttp: AuthHttp) {
    this.authHttp = authHttp;
  }

  invite(data) {
    const maskedData = _.pick(data, ["name", "company", "email"]);
    return this.authHttp.post("v1/admin/assessors", maskedData, [200, 409]);
  }

  list(options) {
    const fullOptions = _.defaults(options, { page: 1, size: 1 });
    const params = new URLSearchParams();
    _.each(fullOptions, (value, key) => {
      params.set(`${key}`, value);
    });
    return this.authHttp.get("v1/admin/assessors", { search: params });
  }
}
