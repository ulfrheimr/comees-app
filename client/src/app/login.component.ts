import {  OnInit, Component, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { MaterializeAction } from 'angular2-materialize';

import { UsrService } from './services/usr.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [
  ]
})

export class LoginComponent implements OnInit {
  pageModel: any;
  error: string;
  constructor(
    private usrService: UsrService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.usrService.dropInfo();

    this.pageModel = {
      usr: undefined,
      pass: undefined
    }
  }

  login(): void {
    this.usrService.init(this.pageModel.usr, this.pageModel.pass)
      .then(u => {
        console.log(u)
        if (u.role == "mi") this.router.navigate(['./mi/'])
        else if (u.role == "ph") this.router.navigate(['./ph/'])
        else this.error = "Por favor revise sus credenciales y vuelva a intentar"
      })
  }

  modalActions = new EventEmitter<string|MaterializeAction>();
  openModal() {
    this.modalActions.emit({action:"modal",params:['open']});
  }
  closeModal() {
    this.modalActions.emit({action:"modal",params:['close']});
  }
}
