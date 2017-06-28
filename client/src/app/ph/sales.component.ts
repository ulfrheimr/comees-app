import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GridOptions } from "ag-grid";
import { AddComponent } from '../add.component';
import { DeleteComponent } from '../delete.component';

import { Drug } from '../prots/ph/drug';

import { DrugService } from '../services/ph/drug.service';
import { PhSaleService } from '../services/ph/sale.service';
import { StoredSale } from './stored-sale';

@Component({
  selector: 'ph-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
  providers: [
    DrugService,
    PhSaleService
  ]
})

export class PhSalesComponent implements OnInit {
  pageModel;
  drugs: any = []
  drugHash = {};
  sale: any = []

  constructor(
    private router: Router,
    private storedSale: StoredSale,
    private drugService: DrugService,
    private phSaleService: PhSaleService
  ) {
    this.pageModel = {
      hint: "",
      showGridSale: true
    }
  }

  private gridOptions: GridOptions;

  ngOnInit(): void {
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
        } else {
          this.drugHash[r._id] = {
            id: r._id,
            code: r.code,
            qty: 1,
            name: r.name,
            desc_sale: r.substance + " - " + r.presentation.presentation + " " + r.dosage,
            sale_price: r.sale_price,
            stock: r.stock
          }
        }

        this.setSale();
      })
      .catch(this.handleError)
  }

  searchDrug(): void {
    this.storedSale.sale = this.drugHash;
    this.router.navigate(['./search-drug'])
  }

  setSale(): void {
    let drugs: any = [];
    for (var key in this.drugHash) {
      drugs.push(this.drugHash[key]);
    }

    this.gridOptions.api.setRowData(drugs);
  }

  getTotal(): number {
    let total: number = 0;
    for (var key in this.drugHash)
      total += this.drugHash[key].sale_price * this.drugHash[key].qty;

    return total;
  }

  confirmSale(): void {
    let temp: any = [];

    this.pageModel.showGridSale = false;

    for (var key in this.drugHash) {
      temp.push(this.drugHash[key]);
    }

    this.sale = temp;
  }

  makeSale(): void {
    let s: any[] = this.sale.map(x => {
      return {
        qty: x.qty,
        drug: x.code,
        sale_price: x.sale_price,
        price_discount: x.sale_price
      }
    });

    this.phSaleService.makeSale(s)
      .then(id => {
        this.router.navigate(['./client', "ph", id])
      })
      .catch(err => {
        console.log("IS over here")
      });
  }

}
