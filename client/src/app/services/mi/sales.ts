import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {Observable} from 'rxjs';

import 'rxjs/add/operator/mergeMap';

import { MiSale } from '../../prots/mi-sale';

import { config } from '../../config';

@Injectable()
export class Sales {
  private uri = config.mi + '/invoices';

  constructor(
    private http: Http
  ) {

  }

  private handleError(error: any): Promise<any> {
    console.log(error);
    return Promise.reject(error.message || error);
  }

  private getSales(): Promise<any[]> {
    return this.http.get(this.uri)
      .toPromise()
      .then(r => {
        var a = r.json().data;

        return a;
      })
      .catch(this.handleError);
  }
}
