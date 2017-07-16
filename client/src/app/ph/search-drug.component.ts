import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { GridOptions } from "ag-grid";
import { CellComponent } from '../cell.component';

import { Drug } from '../prots/ph/drug';

import { DrugService } from '../services/ph/drug.service';

import { StoredSale } from './stored-sale';

@Component({
  selector: 'search-drug',
  templateUrl: './search-drug.component.html',
  styleUrls: ['./search-drug.component.css'],
  providers: [
    DrugService
  ]
})

export class SearchDrugComponent implements OnInit {
  pageModel;
  sale: any;
  selectedDrug: any;
  drugs: any = []

  private gridOptions: GridOptions;

  constructor(
    private router: Router,
    private drugService: DrugService,
    private storedSale: StoredSale
  ) {
    this.pageModel = {
      searchType: "name",
      hint: ""
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
        headerName: "nombre",
        field: "name",
        width: 100
      }, {
        headerName: "Sustancia",
        field: "substance",
        width: 200
      }, {
        headerName: "Presentación",
        field: "pres_desc",
        width: 250
      }, {
        headerName: "Precio de Venta",
        field: "sale_price",
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
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  private convertDrug(d: any): any {
    return {
      id: d._id,
      code: d.code,
      name: d.name,
      substance: d.substance,
      pres_desc: d.qty + " " + d.presentation.presentation + " " + d.dosage,
      presentation: d.presentation.presentation,
      dosage: d.dosage,
      sale_price: d.sale_price,
      desc: d.desc,
      lab: d.lab.lab
    }
  }

  searchDrug(): void {
    this.drugService.getDrugs(this.pageModel.hint, this.pageModel.searchType)
      .then(r => {
        this.drugs = r.map(x => this.convertDrug(x));
        this.gridOptions.api.setRowData(this.drugs);
      })
      .catch(this.handleError);
  }

  addToSale(): void {
    this.storedSale.sale = {
      qty: 1,
      code: this.selectedDrug.code,
      id: this.selectedDrug.id
    };

    var url = this.router.url.split('/');
    let routeUrl: string = url.slice(1, url.length - 1).reduce((x, y) => x + "/" + y, "");

    this.router.navigate(['.' + routeUrl + '/sales'])
  }

  onSelected(d: any): void {
    this.selectedDrug = d;
  }
}
