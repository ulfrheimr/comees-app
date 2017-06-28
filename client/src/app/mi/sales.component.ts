import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import { GridOptions } from "ag-grid";
import { CellComponent } from '../cell.component';

import { Mi } from '../prots/mi';

import { MiService } from '../services/mi.service';
import { CouponService } from '../services/coupon.service';
import { MiSaleService } from '../services/mi-sale.service';

@Component({
  selector: 'mi-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
  providers: [
    MiService,
    CouponService,
    MiSaleService
  ]
})

export class MiSalesComponent implements OnInit {
  mis: Mi[];
  pageModel;
  selectedMi: any;
  products: any[] = [];
  discount: number = 0;
  priceDiscount: number;

  private gridOptions: GridOptions;

  constructor(
    private miService: MiService,
    private couponService: CouponService,
    private miSaleService: MiSaleService,
    private router: Router
  ) {
    this.pageModel = {
      hint: "",
      toggleDiscount: null,
      discountType: "",
      discountCode: "",
      discountFound: null,
      notFoundDiscount: null,
    }
  }

  ngOnInit(): void {
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

  addToSale(): void {
    this.products.push({
      qty: 1,
      mi: this.selectedMi._id, //id_mi
      name: this.selectedMi.name,
      sale_price: this.selectedMi.price,
      price_discount: this.priceDiscount == undefined ? this.selectedMi.price : this.priceDiscount,
      type_discount: this.pageModel.discountType,
      discount: this.discount
    });
    console.log(this.products)
  }

  onSelected(mi: Mi): void {
    this.selectedMi = mi;
  }

  makeSale(): void {
    this.miSaleService.makeSale(this.products)
      .then(id => {
        console.log(id)
        this.router.navigate(['./client', "mi", id])
      })
      .catch(this.handleError);
  }

}
