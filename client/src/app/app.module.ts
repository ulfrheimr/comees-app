import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MdCardModule } from '@angular2-material/card';
import { MdButtonModule } from '@angular2-material/button';
import { MdIconModule } from '@angular2-material/icon';
import { MdIconRegistry } from '@angular2-material/icon';
import { MdCoreModule, MdMenuModule } from '@angular/material';

import { HttpModule } from '@angular/http';
import { AgGridModule } from "ag-grid-angular/main";

import { Ph } from './ph/ph.component';
import { PhSalesComponent } from './ph/sales.component';
import { SearchDrugComponent } from './ph/search-drug.component';
import { PrintPhTicketComponent } from './ph/print-ticket.component';
import { ImportPurchase } from './ph/import-purchase.component';

import { Mi } from './mi/mi.component';
import { MiSalesComponent } from './mi/sales.component';
import { MiSalesReportComponent } from './mi/sales-report.component';
import { PrintMiTicketComponent } from './mi/print-ticket.component';

import { PrintComponent } from './print.component';
import { ClientComponent } from './cc/client.component';

import { Sales } from './sales.component';

import { Admin } from './admin/admin.component';
import { ModifyMIComponent } from './admin/modify_mi.component';
import { InvoiceComponent } from './admin/invoices.component';

import { MUtils } from './utils';

import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { CellComponent } from './cell.component';
import { AddComponent } from './add.component';
import { DeleteComponent } from './delete.component';
import { StoredSale } from './ph/stored-sale';
import { PassMi } from './pass-mi';

import { Config } from './services/config';

import { AppRoutingModule } from './app-routing.module';

import { MaterializeModule } from "angular2-materialize";

import { UsrActivate } from './guard/usr-activate';
import { UsrService } from './services/usr.service';
import { ClientService } from './services/client.service';
import { UsrInfoService } from './services/cc/usr-info.service';

@NgModule({
  declarations: [
    Ph,
    PhSalesComponent,
    SearchDrugComponent,
    PrintPhTicketComponent,
    ImportPurchase,
    Mi,
    MiSalesComponent,
    MiSalesReportComponent,
    PrintMiTicketComponent,
    Admin,
    ModifyMIComponent,
    Sales,
    InvoiceComponent,
    PrintComponent,
    AppComponent,
    LoginComponent,
    ClientComponent,
    CellComponent,
    AddComponent,
    DeleteComponent,
  ],
  imports: [
    //Aungular
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    // Material Design
    MdCoreModule,
    MdCardModule,
    MdButtonModule,
    MdIconModule,
    MdMenuModule,
    AppRoutingModule,

    MaterializeModule,
    AgGridModule.withComponents(
      [CellComponent,
        AddComponent,
        DeleteComponent]
    )
  ],
  providers: [
    MdIconRegistry,
    PassMi,
    StoredSale,
    Config,
    UsrActivate,
    UsrService,
    ClientService,
    UsrInfoService,
    MUtils],
  bootstrap: [AppComponent]
})
export class AppModule { }
