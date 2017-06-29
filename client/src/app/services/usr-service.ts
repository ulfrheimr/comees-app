import { Injectable } from '@angular/core';

@Injectable()
export class UsrService {
  constructor() {

  }

  get(): any {
    return "Hola";
  }
}
