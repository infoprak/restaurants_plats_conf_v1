import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CfShiftsComponent } from './project/components/views/cf-shifts/cf-shifts.component';
import { CfUpdateMenuComponent } from './project/components/views/cf-update-menu/cf-update-menu.component';
import { HttpClientModule } from '@angular/common/http';
import { CfKitchenComponent } from './project/components/views/cf-kitchen/cf-kitchen.component';
import { CfOrdersAllComponent } from './project/components/views/cf-orders-all/cf-orders-all.component';
import { MenuComponent } from './project/components/views/menu/menu.component';

@NgModule({
  declarations: [
    AppComponent,
    CfShiftsComponent,
    CfUpdateMenuComponent,
    CfKitchenComponent,
    CfOrdersAllComponent,
    MenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
