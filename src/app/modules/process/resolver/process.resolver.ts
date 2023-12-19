import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { ProcessService } from 'app/modules/process/process.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'any'
})
export class FormProcessResolver implements Resolve<any>
{

  constructor(private processService: ProcessService, private route: ActivatedRoute, private router: Router) {
  }

  resolve(actroute: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const id = actroute.params['id']
    return this.processService.getProcessById(id)
  }
}
