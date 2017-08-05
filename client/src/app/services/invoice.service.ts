import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/mergeMap';
import { config } from '../config';

@Injectable()
export class InvoiceService {
  // private uri = 'http://localhost:3000/invoices';
  private uri = config.cc + '/invoices';
  private paymentTypes = {
    "debit": "28",
    "credit": "04",
    "cash": "01"
  }

  constructor(
    private http: Http
  ) {

  }

  private handleError(error: any): Promise<any> {
    console.log(error);
    return Promise.reject(error.message || error);
  }

  sendToInvoice(clientId: string,
    saleId: string,
    type: string,
    paymentType: string,
    account: string): Promise<any> {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    if (!this.paymentTypes[paymentType])
      throw "Método de pago no permitido";

    console.log(this.paymentTypes[paymentType])

    var data = {
      id_sale: saleId,
      id_client: clientId,
      type: type,
      paymentType: this.paymentTypes[paymentType],
      account: account
    }

    console.log(data)

    return this.http.put(this.uri, data, { headers: headers })
      .toPromise()
      .then(r => r.json().ok)
      .catch(this.handleError);
  }
}
