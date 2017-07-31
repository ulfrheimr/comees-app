import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {Observable} from 'rxjs';

import 'rxjs/add/operator/mergeMap';

import { MiSale } from '../prots/mi-sale';
import { MiProduct } from '../prots/mi-product';

import { UsrService } from './usr.service';

@Injectable()
export class MiSaleService {
  private uri = 'http://192.168.99.100:3001/sales';
  // private uri = 'http://localhost:3001/sales';

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

  private addMi(idSale: string, mis: any[]): Promise<string> {
    let mi: any = mis.pop();

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    mi['id_sale'] = idSale;

    console.log(mi)

    return this.http.post(this.uri, mi, { headers: headers })
      .toPromise()
      .then(r => {
        if (mis.length > 0)
          return this.addMi(idSale, mis)
            .then(idSale => idSale)
            .catch(this.handleError);
      })
      .catch(this.handleError);
  }

  getSale(id: string): Promise<any[]> {
    return this.http.get(this.uri + "/" + id)
      .toPromise()
      .then(r => {
        let sale: MiSale = r.json().data as MiSale;

        var result = {
          timestamp: sale.timestamp,
          mis: sale.mis.map(x => this.convertMi(x))
        }
        return result;
      })
      .catch(this.handleError);
  }

  private convertMi(mi: any): any {
    var res = {
      sale_price: mi.sale_price,
      price_discount: mi.price_with_discount,
      qty: mi.qty,
      mi: mi.mi.name
    }

    return res;
  }

  makeSale(mis: any[]): Promise<string> {

    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return new Promise((resolve, reject) => {
      this.createSale()
        .then(id => {
          console.log(mis)
          this.addMi(id, mis)
            .then(idSale => {
              resolve(id)
            })
            .catch(this.handleError)
        })
        .catch(this.handleError)
    });

  }


}
