import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Drug } from '../../prots/ph/drug';

@Injectable()
export class DrugService {
  // private uri = 'http://localhost:3002/drugs';
  // private uriDrug = 'http://localhost:3002/stock';

  private uri = 'http://192.168.99.100:3002/drugs';
  private uriDrug = 'http://192.168.99.100:3002/stock';

  constructor(private http: Http) { }

  private handleError(error: any): Promise<any> {
    console.log(error);
    return Promise.reject(error.message || error);
  }

  getDrugs(search: string, by: string): Promise<Drug[]> {
    return this.http.get(this.uri + "?search=" + search + "&by=" + by)
      .toPromise()
      .then(r => r.json().data as Drug)
      .catch(this.handleError);
  }

  getDrug(code: string): Promise<any> {
    return this.http.get(this.uriDrug + "/" + code)
      .toPromise()
      .then(r => {
        var data = r.json().data;
        var drug = data.drug;

        if (data.stock != undefined) {
          drug["stock"] = data.stock.qty < 0 ? 0 : data.stock.qty;
        } else {
          drug["stock"] = 0
        }

        return drug;
      })
      .catch(this.handleError);
  }
}
