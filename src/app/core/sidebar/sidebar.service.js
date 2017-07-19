import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
@Injectable()
export class ToggleService {
  toggleSource = new Subject();

  toggle = this.toggleSource.asObservable();

  toggleSidebar(mission: string) {
    this.toggleSource.next(mission);
  }
}
