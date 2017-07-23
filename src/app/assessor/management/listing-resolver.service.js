import { Injectable } from "@angular/core";

import { AssessorService } from "../assessor.service";
@Injectable()
export class AssessorListResolver {
  constructor(assessorService: AssessorService) {
    this.assessorService = assessorService;
  }

  resolve() {
    return this.assessorService.list();
  }
}
