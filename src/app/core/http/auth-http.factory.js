import { Http, RequestOptions } from '@angular/http';
import { AuthConfig } from 'angular2-jwt';
import { CustomAuthHttp } from './auth-http.wrapper';

/*
 * Our Factory that creates the instance of CustomAuthHttp and configures it.
 */
export function authHttpServiceFactory(http: Http, options: RequestOptions) {
  return new CustomAuthHttp(
    new AuthConfig({
      noJwtError: true,
      globalHeaders: [
        { 'Content-Type': 'application/json' },
        { Accept: 'application/json' },
      ],
    }),
    http,
    options,
  );
}
