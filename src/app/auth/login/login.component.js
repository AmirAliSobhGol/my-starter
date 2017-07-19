import {Component} from '@angular/core'
import {Router} from '@angular/router'
import {
  FormBuilder,
  Validators
} from '@angular/forms';

import {AppAuthService} from '../auth.service'

@Component({
  styleUrls: ['../auth.module.scss'],
  templateUrl: 'login.component.pug'
})
export class LoginComponent {

  constructor(authService: AppAuthService, router: Router, formBuilder: FormBuilder) {
    this.router = router;
    this.formBuilder = formBuilder;
    this.authService = authService;
  }

  ngOnInit() {
    this.showError = false;
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(10)]],
      remember: true,
    })
  }

  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value)
        .subscribe(
          () => this.router.navigate(['/home']),
          (err) => this.showError = true,
        )
    }
  }
}
