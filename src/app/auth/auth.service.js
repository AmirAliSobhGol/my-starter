import {Injectable} from '@angular/core';
import {AuthHttp} from 'angular2-jwt';

@Injectable()
export class AppAuthService {

  constructor(authHttp: AuthHttp) {
    this.authHttp = authHttp;
  }

  login(credentials) {
    const maskedCredentials = _.pick(credentials, ['email', 'password', 'remember']);
    return this.authHttp
      .post('v1/dashboard/login', maskedCredentials);
  }
}
