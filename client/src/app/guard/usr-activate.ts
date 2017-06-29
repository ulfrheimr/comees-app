import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';


import { UsrService } from '../services/usr-service';

@Injectable()
export class UsrActivate implements CanActivate {

  constructor(
    private router: Router,
    private usrService: UsrService
  ) {

  }

  canActivate() {
    

    console.log(this.usrService.get());
    this.router.navigate(['./search-drug']);
    return true;
  }
}
