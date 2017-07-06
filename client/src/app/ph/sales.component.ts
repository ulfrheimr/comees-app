import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GridOptions } from "ag-grid";
import { AddComponent } from '../add.component';
import { DeleteComponent } from '../delete.component';

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

  constructor(
    private router: Router,
    private storedSale: StoredSale,
    private couponService: CouponService,
    private drugService: DrugService,
    private phSaleService: PhSaleService,
    private usrService:UsrService
  ) {
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
      paymentType: "cash"
    }
  }

  private gridOptions: GridOptions;

  ngOnInit(): void {
    console.log("Session")
    console.log(this.usrService.get())

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
        width: 100
      }, {
        headerName: "Descripción",
        field: "desc_sale",
        width: 100
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

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  private checkSale(): void {
    console.log(this.storedSale.sale)
    let hasItems: boolean = false;

    for (var key in this.storedSale.sale) {
      hasItems = true;
      break;
    }

    if (hasItems) {
      this.drugHash = this.storedSale.sale;
      setTimeout(() => {
        this.setSale();
      }, 1000);

    }
  }

  findDrug(): void {
    this.drugService.getDrug(this.pageModel.hint)
      .then(r => {
        if (r["stock"] == 0) {
          alert("no se puede agregar sin stock")
          return;
        }

        if (this.drugHash[r._id]) {
          this.drugHash[r._id].qty = this.drugHash[r._id].qty + 1;
          this.drugHash[r._id].price_total = this.drugHash[r._id].qty * this.drugHash[r._id].price_discount;
        } else {
          this.drugHash[r._id] = {
            id: r._id,
            code: r.code,
            qty: 1,
            name: r.name,
            desc_sale: r.substance + " - " + r.presentation.presentation + " " + r.dosage,
            sale_price: r.sale_price,
            price_discount: r.sale_price,
            price_total: r.sale_price,
            stock: r.stock,
            cat: r.cat || 0
          }
        }

        this.setSale();
      })
      .catch(this.handleError)
  }

  searchDrug(): void {
    this.storedSale.sale = this.drugHash;
    this.router.navigate(['./ph/search-drug'])
  }

  setSale(): void {
    let drugs: any = [];
    for (var key in this.drugHash) {
      drugs.push(this.drugHash[key]);
    }

    this.gridOptions.api.setRowData(drugs);
  }

  getDiscount(): void {
    this.pageModel.notFoundDiscount = null;
    this.pageModel.discountFound = null;
    this.couponService.getCoupon(this.pageModel.discountCode)
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
    var total = this.pageModel.amount - this.getTotalDiscount();
    let s: any[] = this.sale.map(x => {
      return {
        qty: x.qty,
        drug: x.code,
        sale_price: x.sale_price,
        price_discount: x.price_discount,
        discount: this.pageModel.discountCode
      }
    });

    this.phSaleService.makeSale(s)
      .then(id => {
        localStorage.setItem('payment', this.pageModel.amount);
        localStorage.setItem('change', total.toString());
        localStorage.setItem('type', this.pageModel.paymentType);

        this.router.navigate(['./ph/client', "ph", id])
      })
      .catch(err => {
        console.log("IS over here")
      });
  }

}
