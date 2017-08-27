import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'mi',
  templateUrl: './mi.component.html',
  styleUrls: ['./mi.component.css'],
  providers: []
})

export class Mi {
  constructor(
    private router: Router
  ) {

  }

  goTo(path: string): void {
    var url = this.router.url.split('/').slice(0, 1).join("/");
    console.log('.' + url + "/" + path)

    this.router.navigate(['.' + url + "/" + path])
  }
}
