import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {Mi} from '../prots/mi';

@Injectable()
export class MiService {
  private miUrl = 'http://192.168.99.100:3001/mis';
  // private miUrl = 'http://localhost:3001/mis';

  constructor(private http: Http) { }

  getMis(name: string): Promise<Mi[]> {
    return this.http.get(this.miUrl + "?name=" + name)
      .toPromise()
      .then(r => r.json().data as Mi)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.log(error);
    return Promise.reject(error.message || error);
  }
}
