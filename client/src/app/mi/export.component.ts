import {Component, Input, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { GridOptions } from "ag-grid";

@Component({
  selector: 'mi-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css'],
  providers: [
  ]
})

export class MiExportComponent implements OnInit {

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
        headerName: "Estudio",
        field: "name"
      }, {
        headerName: "Precio",
        field: "price"
      }
    ];
    this.gridOptions.rowData = [];
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
