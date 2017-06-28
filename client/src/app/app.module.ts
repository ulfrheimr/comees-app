import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';
import {AgGridModule} from "ag-grid-angular/main";

import { AppComponent } from './app.component';
import { ClientComponent } from './cc/client.component';
import { MiSalesComponent } from './mi/sales.component';
import { PrintMiTicketComponent } from './mi/print-ticket.component';

import { PhSalesComponent } from './ph/sales.component';
import { SearchDrugComponent } from './ph/search-drug.component';
import { PrintPhTicketComponent } from './ph/print-ticket.component';

import { CellComponent } from './cell.component';
import { AddComponent } from './add.component';
import { DeleteComponent } from './delete.component';

import { StoredSale } from './ph/stored-sale';

import {AppRoutingModule} from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    ClientComponent,
    CellComponent,
    MiSalesComponent,
    PrintMiTicketComponent,
    PhSalesComponent,
    SearchDrugComponent,
    AddComponent,
    DeleteComponent,
    PrintPhTicketComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpModule,
    AgGridModule.withComponents(
      [CellComponent,
        AddComponent,
        DeleteComponent]
    )
  ],
  providers: [StoredSale],
  bootstrap: [AppComponent]
})
export class AppModule { }
