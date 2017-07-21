import { Directive, ElementRef, Input } from "@angular/core";
import { AppAuthService } from "core/auth/auth.service";
@Directive({
  selector: "[access]",
})
export class AccessDirective {
  @Input("access") role;

  constructor(element: ElementRef, authService: AppAuthService) {
    this.element = element;
    this.authService = authService;
  }

  ngOnInit() {
    if (this.authService.role() !== this.role) {
      this.element.nativeElement.style.display = "none";
    }
  }
}
