import {  OnInit, Component } from '@angular/core';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [
  ]
})

export class LoginComponent implements OnInit {
  pageModel: any;
  constructor(

  ) {

  }

  ngOnInit(): void {
    this.pageModel = {
      usr: undefined,
      pass: undefined
    }
  }

  login(): void {
    
  }
}
