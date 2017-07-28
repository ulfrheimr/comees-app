import { Injectable, OnInit } from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {Observable} from 'rxjs';

import 'rxjs/add/operator/mergeMap';

import { Invoice } from '../../prots/admin/invoice';

@Injectable()
export class InvoiceService implements OnInit {
  private uri = 'http://localhost:3000/invoices';

  constructor(
    private http: Http
  ) {

  }

  ngOnInit(): void {

  }

  private handleError(error: any): Promise<any> {
    console.log(error);
    return Promise.reject(error.message || error);
  }

  getNotInvoiced(): Promise<Invoice[]> {
    return this.http.get(this.uri + "?invoiced=false&client=true")
      .toPromise()
      .then(c => c.json().data)
      .catch(this.handleError)
  }

  markAsInvoiced(id): Promise<void> {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    var data = { invoice: id };

    return this.http.post(this.uri, data, { headers: headers })
      .toPromise()
      .then(r => {
        console.log(r)
        r.json().data._id
      })
      .catch(this.handleError);
  }
}
