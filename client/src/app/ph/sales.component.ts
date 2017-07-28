import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { GridOptions } from "ag-grid";
import { AddComponent } from '../add.component';
import { DeleteComponent } from '../delete.component';

import { MaterializeAction } from 'angular2-materialize';

import { Drug } from '../prots/ph/drug';

import { DrugService } from '../services/ph/drug.service';
import { PhSaleService } from '../services/ph/sale.service';
import { StoredSale } from './stored-sale';
import { CouponService } from '../services/coupon.service';

import { UsrService } from '../services/usr.service';

@Component({
  selector: 'ph-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
  providers: [
    DrugService,
    PhSaleService,
    CouponService,
    UsrService
  ]
})

export class PhSalesComponent implements OnInit {
  pageModel;
  priceDiscount: number;
  discount: number = 0;
  drugs: any = []
  drugHash = {};
  sale: any = []
  paymentTypes: string[] = ["cash", "debit", "credit"];

  modalActions = new EventEmitter<string | MaterializeAction>();
  modalStock = new EventEmitter<string | MaterializeAction>();

  constructor(
    private router: Router,
    private storedSale: StoredSale,
    private couponService: CouponService,
    private drugService: DrugService,
    private phSaleService: PhSaleService,
    private usrService: UsrService,
    private activatedRoute: ActivatedRoute
  ) {
    this.initializePageModel();
  }

  private gridOptions: GridOptions;

  ngOnInit(): void {
    
    this.getDiscount();

    this.gridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.gridOptions.columnDefs = [
      {
        headerName: "Cantidad",
        field: "qty",
        width: 100
      }, {
        headerName: "Nombre",
        field: "name",
        width: 200
      }, {
        headerName: "Descripción",
        field: "desc_sale"
      }, {
        headerName: "Stock",
        field: "stock",
        width: 100
      }, {
        headerName: "Precio de Venta",
        field: "sale_price",
        width: 100
      },
      {
        headerName: "Importe unitario",
        field: "price_discount",
        width: 100
      }, {
        headerName: "Importe",
        field: "price_total",
        width: 100
      }, {
        headerName: "Eliminar",
        field: "delete",
        cellRendererFramework: DeleteComponent,
        colId: "delete",
        width: 120
      }
    ];
    this.gridOptions.rowData = [];

    this.checkSale();
  }

  private initializePageModel(): void {
    this.pageModel = {
      hint: "",
      showGridSale: true,
      showConfirmSale: null,
      toggleDiscount: null,
      discountCode: null,
      noFoundDiscount: null,
      discountFound: null,
      toConfirm: null,
      amount: null,
      paymentType: "cash",
      allowConfirm: false,
      allowSale: true,
      amountError: undefined
    }
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  private checkSale(): void {

    let hasItems: boolean = false;

    for (var key in this.storedSale.sale) {
      hasItems = true;
      break;
    }

    if (hasItems) {
      console.log(this.storedSale.sale)
      let id: string = this.storedSale.sale["code"];
      setTimeout(() => {
        this.findDrug(id);
      }, 1000);

    }
  }

  toggleDiscount(e: boolean): void {
    this.pageModel.toggleDiscount = e;
    this.pageModel.allowSale = !e;

  }

  findDrug(code: string): void {
    this.pageModel.hint = "";

    this.drugService.getDrug(code)
      .then(r => {
        if (this.drugHash[r._id]) {
          if (r["stock"] - this.drugHash[r._id].qty <= 0) {
            this.showNoStock();
            return;
          }
          this.drugHash[r._id].qty += 1;
          this.drugHash[r._id].price_total = this.drugHash[r._id].qty * this.drugHash[r._id].price_discount;
          this.drugHash[r._id].stock -= 1;
        } else {
          if (r["stock"] == 0) {
            this.showNoStock();
            return;
          }

          this.drugHash[r._id] = {
            id: r._id,
            code: r.code,
            qty: 1,
            name: r.name,
            desc_sale: r.substance + " - " + r.presentation.presentation + " " + r.dosage,
            sale_price: r.sale_price,
            price_discount: r.sale_price,
            price_total: r.sale_price,
            stock: r.stock - 1,
            cat: r.cat || 0
          }
        }

        this.setSale();
      })
      .catch(this.handleError)
  }

  searchDrug(): void {
    this.storedSale.sale = this.drugHash;

    var url = this.router.url.split('/');
    let routeUrl: string = url.slice(1, url.length - 1).reduce((x, y) => x + "/" + y, "");
    this.router.navigate(['.' + routeUrl + '/search-drug'])
  }

  setSale(): void {
    let drugs: any = [];
    for (var key in this.drugHash) {
      drugs.push(this.drugHash[key]);
    }

    this.pageModel.allowConfirm = drugs.length > 0;

    this.gridOptions.api.setRowData(drugs);
  }

  getDiscount(): void {
    let segment: string = this.router.url.split('/')[1];

    this.pageModel.notFoundDiscount = null;
    this.pageModel.discountFound = null;
    this.couponService.getCoupon(this.pageModel.discountCode, segment)
      .then((d) => {
        this.pageModel.discountFound = true;
        this.discount = d.discount;
      })
      .catch((err) => {
        this.pageModel.notFoundDiscount = true;
      })
  }

  applyDiscount(): void {
    Object.keys(this.drugHash).map((key, index) => {
      this.drugHash[key].price_discount = this.drugHash[key].sale_price * ((100 - this.discount) / 100);
    });

    this.pageModel.allowSale = true;
  }

  getTotal(): number {
    let total: number = Object.keys(this.drugHash).map((key, index) => {
      return this.drugHash[key].sale_price * this.drugHash[key].qty;
    }).reduce((x, y) => x + y, 0);

    return total;
  }

  getTotalDiscount(): number {
    let total: number = Object.keys(this.drugHash).map((key, index) => {
      return this.drugHash[key].price_discount * this.drugHash[key].qty;
    }).reduce((x, y) => x + y, 0);

    return total;
  }

  confirmSale(): void {
    let temp: any = [];

    this.pageModel.showGridSale = false;

    for (var key in this.drugHash) {
      temp.push(this.drugHash[key]);
    }

    this.sale = temp;
    this.pageModel.showConfirmSale = true;
  }

  change(): number {
    if (parseFloat(this.pageModel.amount)) {
      var total = this.getTotalDiscount()

      if (parseFloat(this.pageModel.amount) >= total) {
        return this.pageModel.amount - total;
      }
    }
  }

  toConfirm(): void {
    this.pageModel.showConfirmSale = false;
    this.pageModel.toConfirm = true;
  }

  makeSale(): void {
    if(this.pageModel.paymentType == "cash"){
      if(!parseFloat(this.pageModel.amount)){
        this.pageModel.amountError = "Importe no válido";
        return;
      }

      if(this.pageModel.amount < this.getTotalDiscount()){
        this.pageModel.amountError = "El importe tiene que ser mayor";
        return;
      }
    }




    this.modalActions.emit({ action: "modal", params: ['close'] });

    var url = this.router.url.split('/');
    let routeUrl: string = url.slice(1, 2).reduce((x, y) => x + "/" + y, "");

    var total = parseFloat((this.pageModel.amount - this.getTotalDiscount()).toFixed(2));
    let s: any[] = this.sale.map(x => {
      return {
        qty: x.qty,
        drug: x.code,
        sale_price: parseFloat(x.sale_price).toFixed(2),
        price_discount: parseFloat(x.price_discount).toFixed(2),
        discount: this.pageModel.discountCode
      }
    });

    this.phSaleService.makeSale(s)
      .then(id => {
        localStorage.setItem('payment', this.pageModel.amount);
        localStorage.setItem('change', total.toString());
        localStorage.setItem('type', this.pageModel.paymentType);

        this.router.navigate(['.' + routeUrl + '/client', "ph", id])
      })
      .catch(err => {
        console.log("IS over here")
      });
  }

  showPayment(): void {
    this.modalActions.emit({ action: "modal", params: ['open'] });
  }
  closeModal() {
    this.modalActions.emit({ action: "modal", params: ['close'] });
  }

  showNoStock(): void {
    this.modalStock.emit({ action: "modal", params: ['open'] });
  }

}
