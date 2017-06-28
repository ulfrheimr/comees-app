import {Component} from "@angular/core";
import {ICellRendererAngularComp} from "ag-grid-angular/main";

@Component({
  selector: 'mi-invoke',
  template: `<span><button style="height: 20px" (click)="add()">Agregar</button></span>`
})
export class AddComponent implements ICellRendererAngularComp {
  public params: any;

  agInit(params: any): void {
    this.params = params;
  }

  public add() {
    this.params.context.componentParent.onAdd(this.params.data);
  }
}
