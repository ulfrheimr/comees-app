import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import { config } from '../../config';

import { UsrInfo } from '../../prots/cc/usr-info'

import 'rxjs/add/operator/toPromise';

@Injectable()
export class UsrInfoService {
  private uri = config.cc + '/usrs_info';

  constructor(
    private http: Http
  ) {

  }

  private handleError(error: any): Promise<any> {
    console.log(error);
    return Promise.reject(error.message || error);
  }

  getUsrsInfo(): Promise<UsrInfo[]> {
    return this.http.get(this.uri)
      .toPromise()
      .then(r => {
        var d = r.json().data;

        return d as UsrInfo[];
      })
      .catch(this.handleError);
  }
}
