import { Injectable } from "@angular/core";
import { AuthHttp } from "angular2-jwt";
import { Response } from "@angular/http";
import "rxjs/add/operator/do";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/operator/retry";
import { Observable, Subject } from "rxjs";

export const HttpErrors = {
  SomethingWentWrongError: "SomethingWentWrongError",
};

/*
 * Here we extend the AuthHttp to automatically add our API url and handle token.
 * you can modify to add interceptors, logging etc. as well
 */
@Injectable()
export class CustomAuthHttp extends AuthHttp {
  errorSource = new Subject();
  errors = this.errorSource.asObservable();

  get(url, options, expectedStatuses) {
    return super
      .get(API_URL + url, options)
      .do(this.handleToken.bind(this))
      .map(this.extractData)
      .retry(2)
      .catch(this.handleError(expectedStatuses));
  }

  post(url, body, expectedStatuses, options) {
    return super
      .post(API_URL + url, JSON.stringify(body), options)
      .do(this.handleToken.bind(this))
      .map(this.extractData)
      .retry(2)
      .catch(this.handleError(expectedStatuses));
  }

  put(url, body, expectedStatuses, options) {
    return super
      .put(API_URL + url, JSON.stringify(body), options)
      .do(this.handleToken.bind(this))
      .map(this.extractData)
      .retry(2)
      .catch(this.handleError(expectedStatuses));
  }

  delete(url, expectedStatuses, options) {
    return super
      .delete(API_URL + url, options)
      .do(this.handleToken.bind(this))
      .map(this.extractData)
      .retry(2)
      .catch(this.handleError(expectedStatuses));
  }

  emitError(event) {
    this.errorSource.next(event);
  }

  handleError(expectedStatuses = [200]) {
    return error => {
      // Show a something went wrong notification if the status isn't what is expected
      if (!expectedStatuses.includes(error.status)) {
        this.emitError(error);
      }
      let err;
      if (error instanceof Response) {
        err = error.json() || "";
      } else {
        err = error.message ? error.message : error.toString();
      }
      return Observable.throw(err);
    };
  }

  extractData(res) {
    const body = res.json();
    return body.data || {};
  }

  /*
   * this method is added, because the server sends a refresh token on requests
   */
  handleToken(res) {
    const token = res.headers.get("Authorization");
    if (token) {
      localStorage.setItem(TOKEN_NAME, token);
    }
  }
}
