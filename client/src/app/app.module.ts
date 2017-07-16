import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';
import {AgGridModule} from "ag-grid-angular/main";

import { Ph } from './ph/ph.component';

import { Mi } from './mi/mi.component';

import { Sales } from './sales.component';
import { MUtils } from './utils';

import { AppComponent } from './app.component';
import { ClientComponent } from './cc/client.component';
import { MiSalesComponent } from './mi/sales.component';
import { PrintMiTicketComponent } from './mi/print-ticket.component';
import { LoginComponent } from './login.component';

import { PhSalesComponent } from './ph/sales.component';
import { SearchDrugComponent } from './ph/search-drug.component';
import { PrintPhTicketComponent } from './ph/print-ticket.component';

import { CellComponent } from './cell.component';
import { AddComponent } from './add.component';
import { DeleteComponent } from './delete.component';

import { StoredSale } from './ph/stored-sale';

import { Config } from './services/config';

import {AppRoutingModule} from './app-routing.module';

import { MaterializeModule } from "angular2-materialize";

import { UsrActivate } from './guard/usr-activate';
import { UsrService } from './services/usr.service';

@NgModule({
  declarations: [
    Ph,
    Mi,
    Sales,
    AppComponent,
    LoginComponent,
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
    MaterializeModule,
    AgGridModule.withComponents(
      [CellComponent,
        AddComponent,
        DeleteComponent]
    )
  ],
  providers: [StoredSale, Config, UsrActivate, UsrService, MUtils],
  bootstrap: [AppComponent]
})
export class AppModule { }
