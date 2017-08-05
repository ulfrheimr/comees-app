import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import {Mi} from '../prots/mi';

import { config } from '../config';

@Injectable()
export class MiService {
  private miUrl = config.mi + '/mis';

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
