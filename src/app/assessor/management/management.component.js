import { Component } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute } from "@angular/router";
import _ from "lodash";

import { AssessorService } from "../assessor.service";

@Component({
  templateUrl: "management.component.pug",
  styleUrls: ["../assessor.module.scss"],
})
export class ManagementComponent {
  constructor(
    formBuilder: FormBuilder,
    assessorService: AssessorService,
    toastService: ToastrService,
    route: ActivatedRoute,
  ) {
    this.formBuilder = formBuilder;
    this.assessorService = assessorService;
    this.toastService = toastService;
    this.route = route;
  }

  ngOnInit() {
    this.page = 1;
    this.route.data.subscribe(data => {
      this.data = data.assessors;
      this.numberOfPages = Math.ceil(this.data.total / 1);
    });
    this.assessorForm = this.formBuilder.group({
      email: ["", [Validators.email]],
      name: ["", [Validators.required]],
      company: ["", [Validators.required]],
    });
  }

  invite() {
    if (this.assessorForm.valid) {
      const assessor = _.clone(this.assessorForm.value);
      this.inviteSubscription = this.assessorService.invite(assessor).subscribe(
        () => {
          this.assessorForm.reset();
          this.data.total += 1;
          this.data.list.unshift(assessor);
          this.data.list.pop();
          this.numberOfPages = Math.ceil(this.data.total / 1);
          this.toastService.success("Invited Assessor");
        },
        error => {
          if (error.statusCode === 409) {
            this.toastService.error("This Assessor is already invited");
          }
        },
      );
    }
  }

  moveToPage(page) {
    this.listSubscription = this.assessorService
      .list({ page })
      .subscribe(data => {
        this.data = data;
        this.page = page;
      });
  }
}
