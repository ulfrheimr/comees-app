import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { MaterializeAction } from 'angular2-materialize';
import { MdButtonModule } from '@angular/material';

import { UsrService } from '../services/usr.service';

@Component({
  selector: 'admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  providers: []
})

export class Admin implements OnInit {
  pageModel: any;
  user: string;
  modalActions = new EventEmitter<string | MaterializeAction>();

  constructor(
    private usrService: UsrService,
    private router: Router
  ) {

  }
  ngOnInit(): void {
    this.initializePageModel();
    this.getUsr();
  }

  private initializePageModel(): void {
    this.pageModel = {
      oldPass: undefined,
      newPass: undefined,
      passConfirmation: undefined,
      error: undefined
    }
  }

  getUsr(): void {
    this.user = this.usrService.get()["name"];
  }

  changePass(): void {
    if (this.pageModel.newPass === this.pageModel.passConfirmation) {

    } else
      this.pageModel.error = "Las contraseñas no concuerdan";
  }

  goTo(path: string) {
    var url = this.router.url.split('/').slice(0, 2).join("/");

    this.router.navigate(['.' + url + "/" + path])
  }

  viewSettings(): void {
    this.showSettings();
  }

  showSettings(): void {
    this.modalActions.emit({ action: "modal", params: ['open'] });
  }
  closeModal() {
    this.modalActions.emit({ action: "modal", params: ['close'] });
  }
}
