import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CfShiftsComponent } from './project/components/views/cf-shifts/cf-shifts.component';
import { CfUpdateMenuComponent } from './project/components/views/cf-update-menu/cf-update-menu.component';
import { CfKitchenComponent } from './project/components/views/cf-kitchen/cf-kitchen.component';
import { CfOrdersAllComponent } from './project/components/views/cf-orders-all/cf-orders-all.component';
import { MenuComponent } from './project/components/views/menu/menu.component';

const routes: Routes = [
  { path:"shifts", component:CfShiftsComponent },
  { path:"menu", component:CfUpdateMenuComponent },
  { path:"orders", component:CfOrdersAllComponent },
  { path:"kitchen", component:CfKitchenComponent },
  { path:"", component:MenuComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
