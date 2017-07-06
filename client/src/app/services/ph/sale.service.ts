import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';
import { Observable } from 'rxjs';

import 'rxjs/add/operator/mergeMap';

import { PhSale } from '../../prots/ph/sale';
import { PhProduct } from '../../prots/ph/ph-product'

import { UsrService } from '../usr.service';


@Injectable()
export class PhSaleService {
  private uri = 'http://localhost:3002/sales';

  constructor(
    private http: Http,
    private usrService: UsrService
  ) {

  }

  private handleError(error: any): Promise<any> {
    console.log(error);
    return Promise.reject(error.message || error);
  }

  private createSale(): Promise<string> {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    var data = { usr: this.usrService.get().id };

    return this.http.put(this.uri, data, { headers: headers })
      .toPromise()
      .then(r => r.json().data._id)
      .catch(this.handleError);
  }

  private addDrug(idSale: string, drugs: any[]): Promise<string> {
    let drug: any = drugs.pop();

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    drug['id_sale'] = idSale;
    drug['type_discount'] = 0

    return this.http.post(this.uri, drug, { headers: headers })
      .toPromise()
      .then(r => {
        console.log(r.status)
        if (drugs.length > 0)
          return this.addDrug(idSale, drugs)
            .then(idSale => idSale)
            .catch(this.handleError);
      })
      .catch(this.handleError);
  }

  makeSale(drugs: any[]): Promise<string> {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return new Promise((resolve, reject) => {
      this.createSale()
        .then(id => {
          console.log(id)
          this.addDrug(id, drugs)
            .then(idSale => resolve(id))
            .catch(this.handleError);
        })
        .catch(this.handleError);
    });
  }

  getSale(id: string): Promise<any> {
    return this.http.get(this.uri + "/" + id)
      .toPromise()
      .then(r => {
        let sale: PhSale = r.json().data as PhSale;


        var result = {
          timestamp: sale.timestamp,
          drugs: sale.drugs.map(x => this.convertDrug(x))
        }

        return result;
      })
      .catch(this.handleError);
  }

  private convertDrug(d: any): any {
    var res = {
      code: d.drug.code.substr(d.drug.code.length - 5),
      qty: d.qty,
      name: d.drug.name,
      desc: d.drug.presentation + " - " + d.drug.dosage + "c/" + (d.drug.qty || ""),
      price: d.sale_price.toFixed(2),
      price_discount: d.price_with_discount.toFixed(2),
      cat: d.drug.cat || 0
    }

    return res;
  }

}
