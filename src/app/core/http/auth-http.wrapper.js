import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import { RequestOptionsArgs, Response } from '@angular/http';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs';

/*
 * Here we extend the AuthHttp to automatically add our API url and handle token.
 * you can modify to add interceptors, logging etc. as well
 */
@Injectable()
export class CustomAuthHttp extends AuthHttp {
  get(url: string, options?: RequestOptionsArgs) {
    return super
      .get(API_URL + url, options)
      .do(this.handleToken.bind(this))
      .map(this.extractData);
  }

  post(url: string, body: any, options?: RequestOptionsArgs) {
    return super
      .post(API_URL + url, JSON.stringify(body), options)
      .do(this.handleToken.bind(this))
      .map(this.extractData)
      .catch(this.handleError);
  }

  put(url: string, body: any, options?: RequestOptionsArgs) {
    return super
      .put(API_URL + url, JSON.stringify(body), options)
      .do(this.handleToken.bind(this))
      .map(this.extractData)
      .catch(this.handleError);
  }

  delete(url: string, options?: RequestOptionsArgs) {
    return super
      .delete(API_URL + url, options)
      .do(this.handleToken.bind(this))
      .map(this.extractData)
      .catch(this.handleError);
  }

  handleError(error) {
    let err;
    if (error instanceof Response) {
      err = error.json() || '';
    } else {
      err = error.message ? error.message : error.toString();
    }
    return Observable.throw(err);
  }

  extractData(res) {
    const body = res.json();
    return body.data || {};
  }

  /*
   * this method is added, because the server sends a refresh token on requests
   */
  handleToken(res) {
    const token = res.headers.get('authorization');
    if (token) {
      localStorage.setItem(TOKEN_NAME, token);
    }
  }
}
