import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {Location} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { PhSaleService } from '../services/ph/sale.service';

@Component({
  selector: 'print-ph-ticket',
  templateUrl: './print-ticket.component.html',
  styleUrls: ['./print-ticket.component.css'],
  providers: [
    PhSaleService
  ]
})

export class PrintPhTicketComponent implements OnInit {
  sale: any;
  hasDiscount: boolean = false;

  constructor(
    private saleService: PhSaleService,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) {

  }

  ngOnInit(): void {
    this.getSale()
  }

  private handleError(error: any): Promise<any> {
    console.log(error);
    return Promise.reject(error.message || error);
  }

  getSale(): void {
    this.activatedRoute.params
      .switchMap((params: Params) => {
        return this.saleService.getSale(params["id"])
          .then(x => this.sale = x)
          .catch(this.handleError)
      })
      .subscribe();
  }

  getSaleTotal(): number {
    return this.sale.drugs.map(x => x.price_discount)
      .reduce((x, y) => x + y, 0);
  }

  getSaleNoDiscount(): number {
    var total = this.sale.drugs.map(x => x.sale_price)
      .reduce((x, y) => x + y, 0);

    if (total > 0)
      this.hasDiscount = true;

    return total;
  }
}
