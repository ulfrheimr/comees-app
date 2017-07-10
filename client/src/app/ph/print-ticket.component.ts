import { Component, OnInit, Input, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { MaterializeAction } from 'angular2-materialize';

import {Location} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';

import { PhSaleService } from '../services/ph/sale.service';

import { Config } from '../services/config';

@Component({
  selector: 'print-ph-ticket',
  templateUrl: './print-ticket.component.html',
  styleUrls: ['./print-ticket.component.css'],
  providers: [
    PhSaleService,
    Config
  ]
})

export class PrintPhTicketComponent implements OnInit {
  sale: any;
  saleTotals: any;
  paymentModel: any;
  hasDiscount: boolean = false;
  client: string;
  paymentTypes: any = {
    "cash": "Efectivo",
    "debit": "Tarjeta de débito",
    "credit": "Tarjeta de crédito",
  }

  modalActions = new EventEmitter<string | MaterializeAction>();

  constructor(
    private saleService: PhSaleService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private config: Config,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.paymentModel = {
      payment: localStorage.getItem("payment"),
      type: this.paymentTypes[localStorage.getItem("type")],
      change: localStorage.getItem("change"),
      client: localStorage.getItem("client") == ""
        ? "Venta de mostrador"
        : localStorage.getItem("client"),
      isCard: localStorage.getItem("type") != "cash"
    }

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
          .then(x => {
            this.sale = x;

            console.log(x)

            this.saleTotals = this.getSaleTotals(x);
          })
          .catch(this.handleError)
      })
      .subscribe();
  }

  getSubtotal(): number {
    return this.saleTotals
      .map(x => x.subtotal)
      .reduce((x, y) => x + y, 0)
      .toFixed(2);
  }

  getSaving(): number {
    return this.saleTotals
      .map(x => x.saving)
      .reduce((x, y) => x + y, 0)
      .toFixed(2);
  }

  getCat(): number {
    return this.saleTotals
      .map(x => x.cat)
      .reduce((x, y) => x + y, 0)
      .toFixed(2);
  }

  getTotal(): number {
    return this.saleTotals
      .map(x => x.total)
      .reduce((x, y) => x + y, 0)
      .toFixed(2);
  }

  getTotalDisc(): number {
    return this.saleTotals
      .map(x => x.total_disc)
      .reduce((x, y) => x + y, 0)
      .toFixed(2);
  }

  getQty(): number {
    return this.saleTotals
      .map(x => x.qty)
      .reduce((x, y) => x + y, 0);
  }

  getSaleTotals(sale): any {
    return sale.drugs.map((x) => {
      var cat = (x.cat || 0) / 100;

      console.log((x.price - x.price_discount) * x.qty)
      return {
        cat: x.price_discount * cat * x.qty,
        subtotal: x.price * x.qty * (1 - cat),
        saving: (x.price - x.price_discount) * x.qty,
        total: x.price * x.qty,
        total_disc: x.price_discount * x.qty,
        qty: x.qty
      };
    });
  }

  getAsset(key): any {
    var r = this.config.get(key);
    return r;
  }

  endProcess(): void {
    this.modalActions.emit({ action: "modal", params: ['close'] });
    this.router.navigate(['./ph/']);
  }

  print(): void {
    this.modalActions.emit({ action: "modal", params: ['open'] });

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
    <body onload="window.print();close();">${printContents}</body>
      </html>`
    );
    popupWin.document.close();
  }
}
