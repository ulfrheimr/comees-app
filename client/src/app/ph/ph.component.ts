import { Component, Input, OnInit, EventEmitter } from '@angular/core';

import { MaterializeAction } from 'angular2-materialize';

import { UsrService } from '../services/usr.service';

@Component({
  selector: 'ph',
  templateUrl: './ph.component.html',
  styleUrls: ['./ph.component.css'],
  providers: []
})

export class Ph {
  pageModel: any;
  user: string;
  modalActions = new EventEmitter<string | MaterializeAction>();

  constructor(
    private usrService: UsrService,
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
    this.user = this.usrService.get()["usr"];
  }

  changePass(): void {
    if (this.pageModel.newPass === this.pageModel.passConfirmation) {

    } else
      this.pageModel.error = "Las contraseñas no concuerdan";
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
