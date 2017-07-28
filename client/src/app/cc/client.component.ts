import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { ActivatedRoute, Params, Router, NavigationEnd } from '@angular/router';

import { MaterializeAction } from 'angular2-materialize';

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

  modalActions = new EventEmitter<string | MaterializeAction>();

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
      showClientRegistration: false,
      allowRegister: true,
      errorCard: undefined
    }

    this.initializeClientModel();
  }

  ngOnInit(): void {
    this.paymentModel = {
      payment: localStorage.getItem("payment"),
      type: localStorage.getItem("type"),
      change: localStorage.getItem("change"),
      account: null
    }

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

  toggleClient(e: boolean): void {
    this.pageModel.specifyClient = !e;
    this.pageModel.allowRegister = e;
    this.pageModel.showClientRegistration = false;
    if (e) {
      this.selectedClient = undefined;
    }
  }

  initializeClientModel(): void {
    this.clientModel = {
      rfc: "",
      name: "",
      phone: "",
      mail: "",
      address: ""
    }
  }

  cancelRegister(): void {
    this.initializeClientModel();
    this.pageModel.specifyClient = true;
    this.pageModel.allowRegister = false;
    this.pageModel.showClientRegistration = false;
  }

  registerNewClient(): void {
    var regRFC = RegExp(/^([A-Z,Ñ,&]{3,4}([0-9]{2})(0[1-9]|1[0-2])(0[1-9]|1[0-9]|2[0-9]|3[0-1])[A-Z|\d]{3})$/)
    var mailReg = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    this.clientModel.err_name = undefined;
    this.clientModel.err_address = undefined;
    this.clientModel.err_phone = undefined;
    this.clientModel.err_rfc = undefined;
    this.clientModel.err_mail = undefined;

    if (this.pageModel.showClientRegistration) {
      let err: boolean = false;

      if (this.clientModel.name == undefined || this.clientModel.name == "") {
        this.clientModel.err_name = "El campo no puede estar vacío";
        err = true;
      }

      if (this.clientModel.address == undefined || this.clientModel.address == "") {
        this.clientModel.err_address = "El campo no puede estar vacío";
        err = true;
      }

      if (this.clientModel.phone == undefined || !this.clientModel.phone.match(/^[0-9\-\.]{4,15}$/im)) {
        this.clientModel.err_phone = "El campo solo permite dígitos y el caracter '-'";
        err = true;
      }

      if (this.clientModel.rfc == undefined || !this.clientModel.rfc.match(regRFC)) {
        this.clientModel.err_rfc = "El RFC no es válido y tiene que ser escrito con mayúsculas";
        err = true;
      }

      if (this.clientModel.mail == undefined || !this.clientModel.mail.match(mailReg)) {
        this.clientModel.err_mail = "Debe indicar un correo válido";
        err = true;
      }

      if (err)
        return;
    }

    this.pageModel.allowRegister = true;

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
    this.selectedClient = client;
    this.pageModel.allowRegister = true;
  }

  registerToInvoice(): void {
    var url = this.router.url.split('/');
    let routeUrl: string = url.slice(1, url.length - 3).reduce((x, y) => x + "/" + y, "");

    this.modalActions.emit({ action: "modal", params: ['close'] });

    let mi: string = this.selectedClient == undefined ? undefined : this.selectedClient._id;
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

          this.router.navigate(['.' + routeUrl + '/' + this.from + '/print-ticket', this.saleId])

        }
      })
      .catch(this.handleError);
  }

  invoiceClient(): string {
    return this.selectedClient == undefined ?
      "Venta de mostrador" :
      this.selectedClient.name + " -  " + this.selectedClient.rfc;
  }

  confirmInvoice(): void {
    this.pageModel.errorCard = undefined;
    if (this.paymentModel.type != "cash" && this.selectedClient) {

      if (this.paymentModel.account == null) {
        this.pageModel.errorCard = "Se deben capturar los 4 dígitos de la tarjeta";
        return;
      }
      if (this.paymentModel.account.toString().length < 4) {
        this.pageModel.errorCard = "Se deben capturar los 4 dígitos de la tarjeta";
        return;
      }

      if (!parseInt(this.paymentModel.account)) {
        this.pageModel.errorCard = "Los números de tarjeta no son válidos";
        return;
      }
    }

    console.log("pass")
    this.modalActions.emit({ action: "modal", params: ['open'] });
  }
  closeModal() {
    this.modalActions.emit({ action: "modal", params: ['close'] });
  }

}
