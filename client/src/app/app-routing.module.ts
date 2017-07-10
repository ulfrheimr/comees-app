import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { Ph } from './ph/ph.component';


import { Mi } from './mi/mi.component';

import { ClientComponent } from './cc/client.component';
import { MiSalesComponent } from './mi/sales.component';
import { PrintMiTicketComponent } from './mi/print-ticket.component';
import { LoginComponent } from './login.component';

import { PhSalesComponent } from './ph/sales.component';
import { PrintPhTicketComponent } from './ph/print-ticket.component';

import { SearchDrugComponent } from './ph/search-drug.component';

import { UsrActivate } from './guard/usr-activate';


const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'ph', component: Ph, canActivate: [UsrActivate],
    children: [
      { path: '', redirectTo: 'sales', pathMatch: 'full' },
      { path: 'sales', component: PhSalesComponent },
      { path: 'client/:type/:id', component: ClientComponent },
      { path: 'print-ticket/:id', component: PrintPhTicketComponent },
      { path: 'search-drug', component: SearchDrugComponent }
    ]
  },
  {
    path: 'mi', component: Mi,canActivate: [UsrActivate],
    children: [
      { path: '', redirectTo: 'sales', pathMatch: 'full' },
      { path: 'sales', component: MiSalesComponent },
      { path: 'client/:type/:id', component: ClientComponent },
      { path: 'print-ticket/:id', component: PrintMiTicketComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
