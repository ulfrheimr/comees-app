import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { Ph } from './ph/ph.component';
import { PhSalesComponent } from './ph/sales.component';
import { PrintPhTicketComponent } from './ph/print-ticket.component';
import { SearchDrugComponent } from './ph/search-drug.component';
import { ImportPurchase } from './ph/import-purchase.component';

import { Mi } from './mi/mi.component';
import { MiSalesComponent } from './mi/sales.component';
import { MiExportComponent } from './mi/export.component';
import { PrintMiTicketComponent } from './mi/print-ticket.component';

import { InvoiceComponent } from './admin/invoices.component';

import { ClientComponent } from './cc/client.component';

import { Sales } from './sales.component';

import { Admin } from './admin/admin.component';

import { LoginComponent } from './login.component';

import { UsrActivate } from './guard/usr-activate';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'ph', component: Ph, canActivate: [UsrActivate],
    children: [
      { path: '', redirectTo: 'sales', pathMatch: 'full' },
      { path: 'ph', redirectTo: 'sales', pathMatch: 'full' },
      { path: 'sales', component: PhSalesComponent },
      { path: 'client/:type/:id', component: ClientComponent },
      { path: 'ph/print-ticket/:id', component: PrintPhTicketComponent },
      { path: 'search-drug', component: SearchDrugComponent },
      { path: 'import', component: ImportPurchase }
    ]
  },
  {
    path: 'mi', component: Mi, canActivate: [UsrActivate],
    children: [
      { path: '', redirectTo: 'sales', pathMatch: 'full' },
      { path: 'mi', redirectTo: 'sales', pathMatch: 'full' },
      { path: 'sales', component: MiSalesComponent },
      { path: 'export', component: MiExportComponent },
      { path: 'client/:type/:id', component: ClientComponent },
      { path: 'mi/print-ticket/:id', component: PrintMiTicketComponent },
    ]
  },
  {
    path: 'sales', component: Sales, canActivate: [UsrActivate],
    children: [
      { path: 'ph', redirectTo: 'ph/sales', pathMatch: 'full' },
      { path: 'ph/sales', component: PhSalesComponent },
      { path: 'client/:type/:id', component: ClientComponent },
      { path: 'ph/print-ticket/:id', component: PrintPhTicketComponent },
      { path: 'ph/search-drug', component: SearchDrugComponent },
      { path: 'mi', redirectTo: 'mi/sales', pathMatch: 'full' },
      { path: 'mi/sales', component: MiSalesComponent },
      { path: 'mi/print-ticket/:id', component: PrintMiTicketComponent },
    ]
  }
  ,
  {
    path: 'admin', component: Admin, canActivate: [UsrActivate],
    children: [
      { path: 'ph', redirectTo: 'ph/sales', pathMatch: 'full' },
      { path: 'ph/sales', component: PhSalesComponent },
      { path: 'client/:type/:id', component: ClientComponent },
      { path: 'ph/print-ticket/:id', component: PrintPhTicketComponent },
      { path: 'ph/search-drug', component: SearchDrugComponent },
      { path: 'mi', redirectTo: 'mi/sales', pathMatch: 'full' },
      { path: 'mi/sales', component: MiSalesComponent },
      { path: 'mi/print-ticket/:id', component: PrintMiTicketComponent },
      { path: 'admin/invoices', component: InvoiceComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
