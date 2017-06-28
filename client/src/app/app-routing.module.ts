import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import { ClientComponent } from './cc/client.component';
import { MiSalesComponent } from './mi/sales.component';
import { PrintMiTicketComponent } from './mi/print-ticket.component';

import { PhSalesComponent } from './ph/sales.component';
import { PrintPhTicketComponent } from './ph/print-ticket.component';

import { SearchDrugComponent } from './ph/search-drug.component';


const routes: Routes = [
  { path: 'client/:type/:id', component: ClientComponent },

  { path: 'mi-sales', component: MiSalesComponent },
  { path: 'print-mi-ticket/:id', component: PrintMiTicketComponent },

  { path: 'ph-sales', component: PhSalesComponent },
  { path: 'print-ph-ticket/:id', component: PrintPhTicketComponent },
  { path: 'search-drug', component: SearchDrugComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
