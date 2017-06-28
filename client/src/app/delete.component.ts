import {Component} from "@angular/core";
import {ICellRendererAngularComp} from "ag-grid-angular/main";

@Component({
  selector: 'mi-invoke',
  template: `<span><button style="height: 20px" (click)="delete()">Eliminar</button></span>`
})
export class DeleteComponent implements ICellRendererAngularComp {
  public params: any;

  agInit(params: any): void {
    this.params = params;
  }

  public delete() {
    this.params.context.componentParent.onDeleted(this.params.data);
  }
}
