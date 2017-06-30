import {  OnInit, Component } from '@angular/core';
import {Router} from '@angular/router';

import { UsrService } from './services/usr-service';

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
    private usrService: UsrService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.pageModel = {
      usr: undefined,
      pass: undefined
    }
  }

  login(): void {

    this.usrService.init(this.pageModel.usr)
      .then(u => {
        console.log(u)
        if (u.role == 1) this.router.navigate(['./mi-sales'])
      })

  }
}
