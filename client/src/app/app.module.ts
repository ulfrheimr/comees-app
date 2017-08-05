import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http';
import {AgGridModule} from "ag-grid-angular/main";

import { Ph } from './ph/ph.component';
import { PhSalesComponent } from './ph/sales.component';
import { SearchDrugComponent } from './ph/search-drug.component';
import { PrintPhTicketComponent } from './ph/print-ticket.component';
import { ImportPurchase } from './ph/import-purchase.component';

import { Mi } from './mi/mi.component';
import { MiSalesComponent } from './mi/sales.component';
import { MiExportComponent } from './mi/export.component';
import { PrintMiTicketComponent } from './mi/print-ticket.component';

import { InvoiceComponent } from './admin/invoices.component';

import { ClientComponent } from './cc/client.component';

import { Sales } from './sales.component';

import { Admin } from './admin/admin.component';

import { MUtils } from './utils';

import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { CellComponent } from './cell.component';
import { AddComponent } from './add.component';
import { DeleteComponent } from './delete.component';
import { StoredSale } from './ph/stored-sale';

import { Config } from './services/config';

import {AppRoutingModule} from './app-routing.module';

import { MaterializeModule } from "angular2-materialize";

import { UsrActivate } from './guard/usr-activate';
import { UsrService } from './services/usr.service';
import { ClientService } from './services/client.service';

@NgModule({
  declarations: [
    Ph,
    PhSalesComponent,
    SearchDrugComponent,
    PrintPhTicketComponent,
    ImportPurchase,
    Mi,
    MiSalesComponent,
    MiExportComponent,
    PrintMiTicketComponent,
    Admin,
    Sales,
    InvoiceComponent,
    AppComponent,
    LoginComponent,
    ClientComponent,
    CellComponent,
    AddComponent,
    DeleteComponent,
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
  providers: [StoredSale,
    Config,
    UsrActivate,
    UsrService,
    ClientService,
    MUtils],
  bootstrap: [AppComponent]
})
export class AppModule { }
