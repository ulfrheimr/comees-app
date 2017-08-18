import { Component, Input, OnInit, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { GridOptions } from "ag-grid";
import { CellComponent } from '../cell.component';

import { MaterializeDirective, MaterializeAction } from 'angular2-materialize';

import { Angular2Csv } from 'angular2-csv/Angular2-csv';

import { Mi } from '../prots/mi';
import { Cat } from '../prots/mi/cat';

import { MiService } from '../services/mi/mi.service';
import { CatService } from '../services/mi/cat.service';

@Component({
  selector: 'modify_mi',
  templateUrl: './modify_mi.component.html',
  styleUrls: ['./modify_mi.component.css'],
  providers: [
    MiService,
    CatService
  ]
})


export class ModifyMIComponent implements OnInit {
  private gridOptions: GridOptions;
  private pageModel: any;
  mis: Mi[];
  cats: any[];
  selectedMi: any;
  testi: any = {};
  modalActions = new EventEmitter<string | MaterializeAction>();


  constructor(
    private miService: MiService,
    private catService: CatService
  ) {
    this.pageModel = {
      hint: undefined,
      allowModify: false,
      hideGrid: false,
      addNewMi: false
    }
  }

  ngOnInit(): void {
    this.getCats();

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
        headerName: "Descripción",
        field: "description"
      },
      {
        headerName: "Precio",
        field: "price"
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

  getCats(): void {
    this.catService.getCats()
      .then((x) => {
        this.cats = x;
      });
  }

  onSelected(mi: Mi): void {
    this.selectedMi = mi;
  }

  newMI(): void {
    this.selectedMi = { category: { _id: "" } };
    this.pageModel.addNewMi = true;
  }

  confirmMI(): void {
    this.modalActions.emit({ action: "modal", params: ['open'] });
  }

  modifyMI(): void {
    this.miService.changeMi(this.selectedMi)
      .then((x) => {
        if (x) {
          this.modalActions.emit({ action: "modal", params: ['close'] });
          this.gridOptions.api.setRowData([]);

        }
        this.selectedMi = undefined;
        this.pageModel.addNewMi = false;
      })
  }

  export(): void {
    var data = [{
      "1": "ESTUDIO",
      "2": "DESCRIPCIÓN",
      "3": "TIEMPO DE ENTREGA",
      "4": "TIPO DE MUESTRA",
      "5": "CATEGORIA",
      "6": "PRECIO DE VENTA"
    }]

    this.miService.getMis("")
      .then((mis) => {
        data = data.concat(mis
          .filter((x) =>
            x.category != undefined
          )
          .map((x) => {
            console.log(x)
            return {
              "1": x.name,
              "2": x.description,
              "3": x.delivery_time,
              "4": x.sample,
              "5": x.category.name,
              "6": x.price
            }
          })
        )

        new Angular2Csv(data, "mis");
      })
      .catch(this.handleError);
  }

  addMi(): void {
    var m = {
      catId: this.selectedMi.category._id,
      name: this.selectedMi.name,
      price: this.selectedMi.price,
      desc: this.selectedMi.description,
      delivery: this.selectedMi.delivery_time,
      sample: this.selectedMi.sample
    }
    this.miService.addMi(m)
      .then((x) => {
        if (x) {
          this.modalActions.emit({ action: "modal", params: ['close'] });
          this.gridOptions.api.setRowData([]);

        }
        this.selectedMi = undefined;
        this.pageModel.addNewMi = false;
      })
  }

  cancel(): void {
    this.selectedMi = undefined;
    this.pageModel.addNewMi = false;
  }

  showPayment(): void {
    this.modalActions.emit({ action: "modal", params: ['open'] });
  }
}
