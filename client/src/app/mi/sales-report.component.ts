import {Component, Input, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { GridOptions } from "ag-grid";

import { Angular2Csv } from 'angular2-csv/Angular2-csv';

import { MiSale } from '../prots/mi-sale';
import { MiSaleService } from '../services/mi-sale.service';
import { UsrInfoService } from '../services/cc/usr-info.service';
import { UsrService } from '../services/usr.service';

import { UsrInfo } from '../prots/cc/usr-info';

@Component({
  selector: 'sales-report',
  templateUrl: './sales-report.component.html',
  styleUrls: ['./sales-report.component.css'],
  providers: [
    MiSaleService
  ]
})

export class MiSalesReportComponent implements OnInit {
  sales: MiSale[];
  usrs: UsrInfo[];
  soldMis: any[];
  pageModel;
  usrDict = {};

  private gridOptions: GridOptions;
  constructor(
    private miSaleService: MiSaleService,
    private usrInfoService: UsrInfoService,
    private usrService: UsrService
  ) {
    this.pageModel = {
      usr: undefined,
      init: undefined,
      end: undefined,
      typeSearch: "day"
    }
  }

  ngOnInit(): void {
    this.getUsrsInfo();

    this.gridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.gridOptions.columnDefs = [
      {
        headerName: "Cantidad",
        field: "qty"
      }, {
        headerName: "Estudio",
        field: "mi.name"
      }, {
        headerName: "Descripción",
        field: "mi.description"
      }, {
        headerName: "Fecha",
        field: "sale_date"
      }, {
        headerName: "Precio",
        field: "price_with_discount"
      }
      , {
        headerName: "Usuario",
        field: "usr"
      }
    ];
    this.gridOptions.rowData = [];
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  getUsrsInfo(): void {
    this.usrInfoService.getUsrsInfo()
      .then((usrs) => {
        usrs.map((x) => {
          this.usrDict[x.id] = x.name + "-" + x.usr;
        });

        this.usrs = usrs;
      })
      .catch(this.handleError);
  }

  search(): void {
    let end: Date = new Date();
    let init: Date = new Date(end.toISOString().split("T")[0] + "T00:00:00.000Z");

    if (this.pageModel.typeSearch == "period") {
      init = new Date(this.pageModel.init + "T00:00:00.000Z")
      end = new Date(this.pageModel.end + "T23:59:00.000Z")
    }

    this.miSaleService.getSales(init.toISOString(),
      end.toISOString(),
      this.pageModel.usr)
      .then((sales) => {
        this.sales = sales;
        this.soldMis = sales.map((s) => {
          var mis = s.mis;
          var d = s.timestamp;
          var u = s["usr"];

          mis.map((x) => {
            var _date = d.toString().split("T")[0]
            var _time = d.toString().split("T")[1].split(":").slice(0, 2).join(":")

            console.log(d)

            x["sale_date"] = _date + " " + _time;
            x["usr"] = this.usrDict[u];
          })
          return mis;
        }).reduce((x, y) => x.concat(y), [])

        this.gridOptions.api.setRowData(this.soldMis);
      })
      .catch(this.handleError);
  }

  report(): void {
    var dateReport = new Date().toISOString().split("T")[0];
    var timeReport = new Date().toISOString().split("T")[1].split(":").slice(0, 2).join(":");
    var usr = this.usrService.get()["usr"];
    let total: number = 0;

    var data = [
      { "1": "Fecha de reporte" },
      { "1": dateReport + " " + timeReport },
      { "1": "Usuario" },
      { "1": usr },
      {
        "1": "Cantidad",
        "2": "Estudio",
        "3": "Descripción",
        "4": "Fecha",
        "5": "Usuario Venta",
        "6": "Precio venta"
      }
    ]

    this.soldMis.map((m) => {
      total += parseFloat(m.price_with_discount);

      data = data.concat([{
        "1": m.qty,
        "2": m.mi.name,
        "3": m.mi.description,
        "4": m.sale_date,
        "5": m.usr,
        "6": m.price_with_discount
      }])
    });

    data = data.concat([{
      "1": "",
      "2": "",
      "3": "",
      "4": "",
      "5": "TOTAL",
      "6": total
    }]);

    new Angular2Csv(data, "Venta_" + dateReport);

  }
}
