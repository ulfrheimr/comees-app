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

  getCoupon(code: string): Promise<Coupon> {
    return this.http.get(this.couponUrl + "/" + code)
      .toPromise()
      .then(r => {
        var data = r.json().data

        if (data.length != 1)
          throw "There's an error retrieving a coupon";

        return data[0] as Coupon
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.log(error);
    return Promise.reject(error.message || error);
  }
}
