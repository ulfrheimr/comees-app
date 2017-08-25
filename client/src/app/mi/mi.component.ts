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
    this.router.navigate([path])
  }
}
