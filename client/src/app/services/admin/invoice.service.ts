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
    return this.http.get(this.uri + "?invoiced=false")
      .toPromise()
      .then(c => c.json().data)
      .catch(this.handleError)
  }
}
