import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { UsrService } from '../services/usr.service';

@Injectable()
export class UsrActivate implements CanActivate {

  constructor(
    private router: Router,
    private usrService: UsrService
  ) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) {
    let role: string = this.usrService.get()["role"];
    let next: string = route.url[0].path;

    if (role == "adm") return true;
    else if (role == "mi" && next == "mi") return true;
    else if (role == "ph" && next == "ph") return true;
    else return false;
  }

  drop(): void {
    // this.usrService.dropInfo();
  }
}
