import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationEnd } from '@angular/router';

import {Location} from '@angular/common';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/pairwise';

import { ClientService } from '../services/client.service';
import { InvoiceService } from '../services/invoice.service';
import { Client } from '../prots/client';

import {GridOptions} from "ag-grid";

import {CellComponent} from '../cell.component'

@Component({
  selector: 'client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.css'],
  providers: [
    ClientService,
    InvoiceService
  ]
})

export class ClientComponent implements OnInit {
  saleId: string;
  from: string;
  clients: Client[];
  selectedClient: Client;
  pageModel;
  clientModel;
  paymentModel: any;

  private gridOptions: GridOptions;

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private router: Router,
    private clientService: ClientService,
    private invoiceService: InvoiceService
  ) {

    this.pageModel = {
      specifyClient: false,
      toggleClient: true,
      clientTypeSearch: "rfc",
      hint: "",
      showClientRegistration: false
    }

    this.clientModel = {
      rfc: "",
      name: "",
      phone: "",
      mail: "",
      address: ""
    }
  }

  ngOnInit(): void {
    this.paymentModel = {
      payment: localStorage.getItem("payment"),
      type: localStorage.getItem("type"),
      change: localStorage.getItem("change"),
      account: null
    }

    console.log(this.paymentModel)

    this.activatedRoute.params
      .switchMap((params: Params) => this.saleId = params["id"])
      .subscribe(s => s);

    this.activatedRoute.params
      .switchMap((params: Params) => this.from = params["type"])
      .subscribe(s => s);

    this.gridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };

    this.gridOptions.columnDefs = [
      {
        headerName: "RFC",
        field: "rfc",
        width: 100
      },
      {
        headerName: "Nombre",
        field: "name",
        width: 300
      }, {
        headerName: "Teléfono",
        field: "phone",
        width: 200
      },
      {
        headerName: "Correo",
        field: "mail",
        width: 200
      },
      {
        headerName: "Seleccionar",
        field: "value",
        cellRendererFramework: CellComponent,
        colId: "select",
        width: 120
      }
    ];
    this.gridOptions.rowData = [];

  }

  private handleError(error: any): Promise<any> {
    console.log(error);
    return Promise.reject(error.message || error);
  }

  getClients(): void {
    this.clientService.getClients(this.pageModel.clientTypeSearch, this.pageModel.hint)
      .then(x => {
        this.clients = x;
        this.gridOptions.api.setRowData(x)
      })
      .catch(this.handleError);
  }

  registerNewClient(): void {
    let c: Client = new Client();

    c.name = this.clientModel.name;
    c.rfc = this.clientModel.rfc;
    c.phone = this.clientModel.phone;
    c.mail = this.clientModel.mail;
    c.address = this.clientModel.address;

    this.clientService.putClient(c)
      .then(client => {
        this.pageModel.showClientRegistration = false;
        this.selectedClient = client
      })
      .catch(this.handleError)
  }

  onSelected(client: Client): void {
    this.pageModel.specifyClient = false;
    this.selectedClient = client
  }

  registerToInvoice(): void {
    console.log(this.pageModel.specifyClient)
    let mi: string = this.selectedClient == undefined  ? undefined : this.selectedClient._id;
    let client: string = this.selectedClient == undefined ? "" : this.selectedClient.name;

    this.invoiceService.sendToInvoice(mi,
      this.saleId,
      this.from,
      this.paymentModel.type,
      this.paymentModel.account)
      .then(result => {
        if (result == 0)
          alert("Venta ya facturada");
        else {
          localStorage.setItem('payment', this.paymentModel.payment);
          localStorage.setItem('change', this.paymentModel.change);
          localStorage.setItem('type', this.paymentModel.type);
          localStorage.setItem('client', client);
          localStorage.setItem('account', this.paymentModel.account);

          alert("Correctamente registrado");

          if (this.from == "mi") {
            this.router.navigate(['./mi/print-ticket', this.saleId])
          } else {
            this.router.navigate(['./ph/print-ticket', this.saleId])
          }

        }
      })
      .catch(this.handleError);
  }

}