import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { MaterializeAction } from 'angular2-materialize';

import { Angular2Csv } from 'angular2-csv/Angular2-csv';

import { GridOptions } from "ag-grid";
import { CellComponent } from '../cell.component';

import { InvoiceService } from '../services/admin/invoice.service';

import { MiSaleService } from '../services/mi-sale.service';
import { PhSaleService } from '../services/ph/sale.service';

import { ClientService } from '../services/client.service';
import { Invoice } from '../prots/admin/invoice';

@Component({
  selector: 'invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css'],
  providers: [
    InvoiceService,
    ClientService,
    MiSaleService,
    PhSaleService
  ]
})

export class InvoiceComponent implements OnInit {
  private invoices: Object[] = [];
  private gridOptions: GridOptions;

  pageModel: any = {};
  selectedInvoice: any;

  modalInvoice = new EventEmitter<string | MaterializeAction>();
  modalMessage = new EventEmitter<string | MaterializeAction>();

  constructor(
    private invoiceService: InvoiceService,
    private miSaleService: MiSaleService,
    private phSaleService: PhSaleService,
    private clientService: ClientService
  ) {

  }

  ngOnInit(): void {
    this.gridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.gridOptions.columnDefs = [
      {
        headerName: "Fecha",
        field: "timestamp",
        width: 100
      }, {
        headerName: "Cliente",
        field: "clientObject.name",
        width: 200
      }, {
        headerName: "Importe",
        field: "total",
        width: 100
      },
      {
        headerName: "Tipo",
        field: "type",
        width: 100
      },
      {
        headerName: "Seleccionar",
        field: "value",
        cellRendererFramework: CellComponent,
        colId: "select",
        width: 100
      }

    ];
    this.gridOptions.rowData = [];

    this.pageModel.message_confirm = "";

    this.getInvoices()
      .then(() => {
        this.gridOptions.api.setRowData(this.invoices);
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  private getInvoices(): Promise<void> {
    return this.invoiceService.getNotInvoiced()
      .then(is => {
        return Promise.all(
          is.map(async (item): Promise<void> => {
            item.total = 0;

            await this.clientService.getClient(item.client)
              .then(x => {
                item.clientObject = x[0];
              })
              .catch(this.handleError);

            if (item.type == "mi") {
              await this.miSaleService.getSale(item.sale)
                .then((x) => {
                  console.log("On MIs")
                  var total = x["mis"].map((d) => parseFloat(d.price_discount))
                    .reduce((x, y) => x + y, 0.0);

                  item.saleObject = x;
                  item.total += total;

                })
                .catch(this.handleError);
            } else {
              await this.phSaleService.getSale(item.sale)
                .then((x) => {
                  console.log("On PHs")
                  var total = x.drugs.map((d) => parseFloat(d.price_discount))
                    .reduce((x, y) => x + y, 0.0);
                  item.saleObject = x
                  item.total += total;
                })
                .catch(this.handleError);
            }

            console.log(item)
            this.invoices.push(item)
          }));
      })
      .catch(this.handleError);
  }

  onSelected(d: any): void {
    this.selectedInvoice = d;
  }

  setAsInvoiced(): void {
    let id: String = this.selectedInvoice["_id"];
    console.log(id);

    this.invoiceService.markAsInvoiced(id)
      .then(() => {
        this.closeConfirmation();
        this.notify("Factura correctamente registrada");

      })
      .catch(this.handleError);

  }

  export(): void {
    this.invoices.map((invoice) => {
      var data = []
      var client = invoice["clientObject"];
      var total = 0.0;
      var total_iva = 0.0;

      data = [{
        "1": "Cliente"
      }, {
          "1": "Cliente",
          "2": client["name"],
        }, {
          "1": "RFC",
          "2": client["rfc"],
        }, {
          "1": "Dirección",
          "2": client["address"],
        }, {
          "1": "Correo",
          "2": client["mail"],
        }];

      data = data.concat([{
        "1": "Métodos de pago"
      }, {
          "1": "Método de pago",
          "2": invoice["paymentMethod"],
        }, {
          "1": "Tipo de pago",
          "2": "" + invoice["paymentType"],
        }, {
          "1": "Moneda",
          "2": "MXN"
        }
      ])

      if (invoice["paymentType"] != '01') {
        data = data.concat([{
          "1": "Cuenta de pago",
          "2": invoice["paymentAccount"]
        }])
      }

      data.push({ "1": "" });
      data.push({ "1": "Productos" });

      if (invoice["type"] == "mi") {
        data = data.concat([
          {
            "1": "Cantidad",
            "2": "Unidad",
            "3": "Medicamento",
            "4": "Precio",
            "5": "IVA",
            "6": "Precio neto",
          }
        ])

        invoice["saleObject"]["mis"].map((m) => {
          m["cat"] = 16.0;
          var temp_iva = (parseFloat(m["cat"]) / 100.0) * (parseFloat(m["price_discount"]));
          var temp_total = (parseFloat(m["price_discount"])) * (1.0 - (parseFloat(m["cat"]) / 100.0));


          data = data.concat([
            {
              "1": m["qty"],
              "2": "Servicio",
              "3": m["mi"],
              "4": m["price_discount"],
              "5": temp_iva.toFixed(2),
              "6": temp_total.toFixed(2)
            }
          ])

          total_iva += temp_iva;
          total += temp_total;
        })
      } else {
        data = data.concat([
          {
            "1": "Cantidad",
            "2": "Unidad",
            "3": "Medicamento",
            "4": "Precio",
            "5": "IVA",
            "6": "Precio neto",
          }
        ])

        invoice["saleObject"]["drugs"].map((d) => {
          var temp_iva = (parseFloat(d["cat"]) / 100.0) * (parseFloat(d["price_discount"]));
          var temp_total = (parseFloat(d["price_discount"])) * (1.0 - (parseFloat(d["cat"]) / 100.0));

          data = data.concat([
            {
              "1": d["qty"],
              "2": "Pieza",
              "3": d["name"] + " - " + d["desc"],
              "4": d["price_discount"],
              "5": temp_iva.toFixed(2),
              "6": temp_total.toFixed(2)
            }
          ])

          total_iva += temp_iva;
          total += temp_total;

        })
      }

      data = data.concat([
        { "1": "Total iva", "2": total_iva.toFixed(2) },
        { "1": "Total", "2": total.toFixed(2) }
      ])


      console.log(data)
      new Angular2Csv(data, invoice["_id"]);
    });
  }

  showConfirmation(): void {
    this.modalInvoice.emit({ action: "modal", params: ['open'] });
  }

  closeConfirmation(): void {
    this.invoices = [];
    this.selectedInvoice = undefined;
    this.modalInvoice.emit({ action: "modal", params: ['close'] });
    this.getInvoices()
      .then(() => {
        this.gridOptions.api.setRowData(this.invoices);
      })
      .catch(this.handleError);
  }

  notify(message: string): void {
    this.pageModel.message_confirm = message;
    this.modalMessage.emit({ action: "modal", params: ['open'] });
  }
}
