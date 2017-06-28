import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/mergeMap';

@Injectable()
export class InvoiceService {
  private uri = 'http://localhost:3000/invoices';

  constructor(
    private http: Http
  ) {

  }

  private handleError(error: any): Promise<any> {
    console.log(error);
    return Promise.reject(error.message || error);
  }

  sendToInvoice(clientId: string, saleId: string, type:string): Promise<any> {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    var data = {
      id_sale: saleId,
      id_client: clientId,
      type:type
    }

    console.log(data)

    return this.http.put(this.uri, data, { headers: headers })
      .toPromise()
      .then(r => r.json().ok)
      .catch(this.handleError);
  }
}
