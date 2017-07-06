import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import { GridOptions } from "ag-grid";
import { CellComponent } from '../cell.component';

import { Mi } from '../prots/mi';

import { MiService } from '../services/mi.service';
import { CouponService } from '../services/coupon.service';
import { MiSaleService } from '../services/mi-sale.service';

import { UsrService } from '../services/usr.service';

@Component({
  selector: 'mi-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
  providers: [
    MiService,
    CouponService,
    MiSaleService,
    UsrService
  ]
})

export class MiSalesComponent implements OnInit {
  mis: Mi[];
  miHash: any = {};
  pageModel;
  selectedMi: any;
  products: any[] = [];
  discount: number = 0;
  priceDiscount: number;
  saleTotal: number = 0;

  private gridOptions: GridOptions;

  constructor(
    private miService: MiService,
    private couponService: CouponService,
    private miSaleService: MiSaleService,
    private usrService:UsrService,
    private router: Router
  ) {
    this.initializePageModel();
  }

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
        headerName: "Estudio",
        field: "name",
        width: 100
      }, {
        headerName: "Precio",
        field: "price",
        width: 100
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
    return Promise.reject(error.message || error);
  }

  private initializePageModel(): void {
    this.pageModel = {
      hint: "",
      toggleDiscount: null,
      discountType: "",
      discountCode: "",
      discountFound: null,
      notFoundDiscount: null,
      toConfirm: false,
      toPayment: false,
      amount: 0,
      paymentType: "cash"
    }
  }

  private setProducts(): void {
    var prods = Object.keys(this.miHash).map((key, index) => {
      return this.miHash[key];
    });

    this.saleTotal = prods
      .map((x) => x.price_discount)
      .reduce((x, y) => x + y, 0);

    this.products = prods;
    this.initializePageModel();
    this.selectedMi = null;
    this.gridOptions.api.setRowData([]);
  }

  findMis(): void {
    if (this.pageModel.hint != "")
      this.miService.getMis(this.pageModel.hint)
        .then((x) => {
          this.mis = x;
          this.gridOptions.api.setRowData(this.mis);
        });
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
    this.priceDiscount = this.selectedMi.price * (1 - (this.discount * 0.01));
  }

  removeMi(id: string): void {
    console.log(id)
    delete this.miHash[id];

    this.setProducts();
  }

  addToSale(): void {
    if (this.miHash[this.selectedMi._id]) {
      this.miHash[this.selectedMi._id]["qty"] += 1;
      this.miHash[this.selectedMi._id]["sale_price"] += this.selectedMi.price;
      this.miHash[this.selectedMi._id]["price_discount"] += this.priceDiscount;
    } else {
      this.miHash[this.selectedMi._id] = {
        qty: 1,
        mi: this.selectedMi._id, //id_mi
        name: this.selectedMi.name,
        sale_price: this.selectedMi.price,
        price_discount: this.priceDiscount == undefined ? this.selectedMi.price : this.priceDiscount,
        type_discount: this.pageModel.discountType,
        discount: this.discount
      }
    }

    this.setProducts();
  }

  onSelected(mi: Mi): void {
    this.selectedMi = mi;
  }

  confirmSale(): void {
    this.pageModel.toConfirm = true;
  }

  confirmPayment(): void {
    this.pageModel.toPayment = true;
  }

  makeSale(): void {
    var total = this.pageModel.amount - this.getTotalDiscount();

    this.miSaleService.makeSale(this.products)
      .then(id => {
        localStorage.setItem('payment', this.pageModel.amount);
        localStorage.setItem('change', total.toString());
        localStorage.setItem('type', this.pageModel.paymentType);

        this.router.navigate(['./mi/client', "mi", id])
      })
      .catch(this.handleError);
  }

  getTotal(): number {
    return Object.keys(this.miHash)
      .map((key, index) => this.miHash[key].sale_price)
      .reduce((x, y) => x + y, 0);
  }

  getTotalDiscount(): number {
    return Object.keys(this.miHash)
      .map((key, index) => this.miHash[key].price_discount)
      .reduce((x, y) => x + y, 0);
  }

  change(): number {
    if (parseFloat(this.pageModel.amount)) {
      var total = this.getTotalDiscount()

      if (parseFloat(this.pageModel.amount) >= total) {
        return this.pageModel.amount - total;
      }
    }
  }

}
