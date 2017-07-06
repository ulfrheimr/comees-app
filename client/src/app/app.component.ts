import { Component } from '@angular/core';

import { UsrActivate } from './guard/usr-activate';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'consultorios Médicos Especializados';
  pageModel: any;

  constructor(
    private usrActivate: UsrActivate
  ) {
  }

  getUsr(): string {

    return null;
  }
}
