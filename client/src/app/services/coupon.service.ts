import {Injectable} from '@angular/core';
import {Headers, Http} from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { Coupon } from '../prots/coupon';

@Injectable()
export class CouponService {
  private couponUrl = 'http://localhost:3000/coupons';

  constructor(private http: Http) { }

  getCoupons(): Promise<Coupon[]> {
    return this.http.get(this.couponUrl + "?init=2011-1-1&end=2012-1-1")
      .toPromise()
      .then(r => r.json().data as Coupon)
      .catch(this.handleError);
  }

  getCoupon(code: string, segment: string): Promise<Coupon> {
    return this.http.get(this.couponUrl + "/" + code)
      .toPromise()
      .then(r => {
        var data = r.json().data

        if (data.length != 1)
          throw "No se ha encontrado el cupón";

        data = data[0];

        if (data["categories"].indexOf(segment) == -1)
          throw "Este cupón no es aplicable a la categoría";

        data["init_date"] = (data["init_date"].replace(/-/gi, "/")).split("T")[0];
        data["end_date"] = (data["end_date"].replace(/-/gi, "/")).split("T")[0];

        let init_date: Date = new Date(data["init_date"])
        let end_date: Date = new Date(data["end_date"])
        if (new Date() >= end_date && new Date() <= init_date)
          throw "Este cupón ha expirado";

        return data[0] as Coupon
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.log(error);
    return Promise.reject(error.message || error);
  }
}
