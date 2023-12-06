import { Component } from "@angular/core";
import { ActivatedRoute, Route, Router } from "@angular/router";
import { Observable } from "rxjs";
import { BreadcrumbService } from "./breadcrumb.service";
import { Breadcrumb, SelectTab } from "./model/breadcrumb.model";


@Component({
  selector: 'gl-breadcrumb',
  templateUrl: './breadcrumb.component.html',
})
export class BreadcrumbComponent {
  breadcrumbs$: Observable<Breadcrumb[]>;
  constructor(private readonly breadcrumbService: BreadcrumbService, private activeRoute: ActivatedRoute, private route: Router) {
    this.breadcrumbs$ = this.breadcrumbService.breadcrumbs$;
  }

  changeItem(selected: SelectTab) {
    this.route.navigate([selected])
    
  }
} 