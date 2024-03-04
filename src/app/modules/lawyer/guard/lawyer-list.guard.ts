import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LawyerListGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // Example condition to check if coming from LawyerList
    // This should be replaced with your actual logic, such as checking a service state or sessionStorage
    const isComingFromLawyerList = sessionStorage.getItem(
      'isComingFromLawyerList',
    );

    if (isComingFromLawyerList) {
      return true;
    } else {
      // Navigate to the parent route or a default route
      this.router.navigate(['/lawyers']); // Replace '/parentRoute' with the actual route
      return false;
    }
  }
}
