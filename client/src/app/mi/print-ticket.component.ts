import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {Location} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { MiSale } from '../prots/mi-sale';
import { MiSaleService } from '../services/mi-sale.service';

@Component({
  selector: 'print-mi-ticket',
  templateUrl: './print-ticket.component.html',
  styleUrls: ['./print-ticket.component.css'],
  providers: [
    MiSaleService
  ]
})

export class PrintMiTicketComponent implements OnInit {
  sale: any = undefined;
  idSale: string;
  hasDiscount: boolean = false;

  constructor(
    private saleService: MiSaleService,
    private activatedRoute: ActivatedRoute,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getSale()
  }

  private handleError(error: any): Promise<any> {
    console.log(error);
    return Promise.reject(error.message || error);
  }

  private getSale(): void {
    this.activatedRoute.params
      .switchMap((params: Params) => {
        return this.saleService.getSale(params["id"])
          .then(x => {
            console.log(x)
            this.sale = x
          })
          .catch(this.handleError)
      })
      .subscribe();
  }

  getSaleTotal(): number {
    return this.sale.mis.map(x => x.price_discount)
      .reduce((x, y) => x + y, 0);
  }

  getSaleNoDiscount(): number {
    var total = this.sale.mis.map(x => x.sale_price)
      .reduce((x, y) => x + y, 0);

    if (total > 0)
      this.hasDiscount = true;

    return total;
  }
}
