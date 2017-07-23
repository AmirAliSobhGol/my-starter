import { Component, Input } from "@angular/core";
import "rxjs/add/operator/catch";

@Component({
  selector: "app-submit-button",
  template: `
  <button class="btn {{className || 'btn-primary'}}" type="submit" style="padding-left: 20px;padding-right: 20px;">
    <span *ngIf='subscription && ! subscription.closed'>
      <i class="fa fa-pulse fa-spinner"></i>
    </span>
    {{text}}
  </button>
`,
})
export class SubmitButtonComponent {
  @Input() subscription;
  @Input() text;
  @Input() className;
}
