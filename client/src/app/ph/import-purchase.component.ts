import { Component, Input, OnInit, EventEmitter } from '@angular/core';

import { GridOptions } from "ag-grid";
import { CellComponent } from '../cell.component';

@Component({
  selector: 'import',
  templateUrl: './import-purchase.component.html',
  styleUrls: ['./import-purchase.component.css'],
  providers: []
})

export class ImportPurchase implements OnInit {
  pageModel: any;

  private gridOptions: GridOptions;

  constructor() {

  }

  ngOnInit(): void {
    this.gridOptions = <GridOptions>{
      context: {
        componentParent: this
      }
    };
    this.gridOptions.columnDefs = [
      {
        headerName: "Código",
        field: "code",
        width: 100
      }, {
        headerName: "Nombre",
        field: "name",
        width: 200
      }, {
        headerName: "Sustancia",
        field: "substance",
        width: 250
      }, {
        headerName: "Presentación",
        field: "presentation",
        width: 100
      },
      {
        headerName: "Dosificación",
        field: "dosage",
        width: 100
      },
      {
        headerName: "Laboratorio",
        field: "lab",
        width: 100
      },
      {
        headerName: "Precio de venta",
        field: "sale_price",
        width: 100
      },
      {
        headerName: "Precio Máximo",
        field: "max_price",
        width: 100
      },
      {
        headerName: "SSA",
        field: "ssa",
        width: 100
      }, {
        headerName: "Description",
        field: "desc",
        width: 100
      },
      {
        headerName: "Cantidad comprada",
        field: "qty",
        width: 100
      },
      {
        headerName: "Seguimiento",
        field: "follows",
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
}
