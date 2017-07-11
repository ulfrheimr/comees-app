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

    console.log(next)
    console.log(role)
    var r = JSON.parse(role);

    if (r["ph"] == "adm" && r["mi"] == "adm") {
      if (next == "ph" || next == "mi")
        return true;
    }
    else if (r["ph"] == "sales" && r["mi"] == "sales") {
      if (next == "ph" || next == "mi")
        return true;
    }
    else if (r["ph"] == "adm") {

    }
    else if (r["ph"] == "sales") {
      if (next == "ph")
        return true;
    }
    else if (r["mi"] == "adm") {

    }
    else if (r["mi"] == "sales") {
      if (next == "mi")
        return true;
    }


    return false;
  }

  drop(): void {
    // this.usrService.dropInfo();
  }
}
