import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'consultorios Médicos Especializados';
  pageModel: any;

  constructor(

  ) {
    this.pageModel = {
      usr: undefined,
      pass: undefined
    }
  }

  getUsr(): string {
    return "Chocorito";
  }
}
