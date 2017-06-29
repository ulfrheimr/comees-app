import {Component, OnInit, Input} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';

import {Location} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { MiSale } from '../prots/mi-sale';
import { MiSaleService } from '../services/mi-sale.service';

import { Config } from '../services/config';

@Component({
  selector: 'print-mi-ticket',
  templateUrl: './print-ticket.component.html',
  styleUrls: ['./print-ticket.component.css'],
  providers: [
    MiSaleService,
    Config
  ]
})

export class PrintMiTicketComponent implements OnInit {
  sale: any = undefined;
  idSale: string;
  hasDiscount: boolean = false;

  constructor(
    private saleService: MiSaleService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private config: Config
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

  getAsset(key): any {
    var r = this.config.get(key);
    console.log(r)
    return r;
  }

  print(): void {
    let printContents, popupWin;
    printContents = document.getElementById('ticket').innerHTML;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
        <style>
        body{
          margin: 0;
        }
        * {
          font-family: 'Arial';
          text-transform: uppercase;
          font-size: 2.7mm;
        }

        table {
          position: relative;
          width: 100%;
        }

        td {
          padding: 1px;
        }

        hr {
          margin: 2mm 0mm 2mm 0mm;
          height: 1px;
          border: none;
          background-color: black;
        }

        .top-container {
          display: inline-block;
          text-align: center;
        }

        .right{
          text-align: right;
        }

        .ticket-container {
          width: 54mm;
        }

        .main-span-ticket {
          padding-right: 4mm;
          margin: 0 auto;
        }

        .logo-container {
          text-align: center;
          width: 100%;
          margin: 100%;
          margin: 0 auto;
        }

        .logo-container p {
          padding-top: 1mm;
          margin: 0 auto;
        }

        .logo {
          padding: 1mm;
          width: 100%;
          margin: 0 auto;
        }

        .bold {
          font-weight: bold;
        }

        .col1 {
          width:15%;
        }
        .col3 {
          width: 20%;
        }

        .sale td {
          text-align: right;
        }

        .totals {
          display: inline-block;
          padding-top: 5mm;
          width: 100%;
        }

        .text-total {
          display: inline-block;
          padding-top: 2mm;
          width: 80%;
          text-align: justify;
        }

        .totals>div {
          width: 70%;
          float: right;
        }

        .slogan {
          padding-top: 3mm;
          text-align: right;
        }

        .client-opts * {
          font-size: 2.2mm;
        }
          </style>
        </head>
    <body onload="window.print();">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }
}
