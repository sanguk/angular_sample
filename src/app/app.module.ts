import { MDBBootstrapModulesPro } from 'ng-uikit-pro-standard';
import { MDBSpinningPreloader } from 'ng-uikit-pro-standard';

import { NgModule, APP_INITIALIZER, Pipe, PipeTransform } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from './pipe/FilterPipe';



// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { JwtInterceptor, ErrorInterceptor, appInitializer } from './_helpers';
import { AuthenticationService } from './_services';
import { HomeComponent } from './home';
import { AdminComponent } from './admin';
import { LoginComponent } from './login';

import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { BoxListComponent } from './lists/box-list/box-list.component';
import { ItemListComponent } from './lists/item-list/item-list.component';
import { RestListComponent } from './lists/rest-list/rest-list.component';
import { FulfilledListComponent } from './lists/fulfilled-list/fulfilled-list.component';
import { TaskListComponent } from './task/task-list/task-list.component';
import { ReturnListComponent } from './lists/return-list/return-list.component';
import { RestockedListComponent } from './lists/restocked-list/restocked-list.component';

import { HoldListComponent } from './lists/hold-list/hold-list.component';
import { PackingSlipListComponent } from './details/packingsliplist/packingsliplist.component';
import { OrderDetailComponent } from './details/orderdetail.component';
import { OrderDetailOnManuComponent } from './details/orderdetailonmanu/orderdetailonmanu.component';
import { PackingComponent } from './packing/packing.component';
import { ReturnComponent } from './return/return.component';
import { OrderCreationComponent } from './order-creation/order-creation.component';
import { ReorderComponent } from './order-creation/reorder/reorder.component';
import { ReorderinitComponent } from './order-creation/reorderinit/reorderinit.component';
import { ShipmentCreationComponent } from './shipment-creation/shipment-creation.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,

    FormsModule,
    ReactiveFormsModule,
    MDBBootstrapModulesPro.forRoot()
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    LoginComponent,
    BoxListComponent,
    ItemListComponent,
    NavMenuComponent,
    RestListComponent,
    FulfilledListComponent,
    TaskListComponent,
    ReturnListComponent,
    RestockedListComponent,
    HoldListComponent,
    OrderDetailComponent,
    OrderDetailOnManuComponent,
    PackingSlipListComponent,
    PackingComponent,
    ReturnComponent,
    OrderCreationComponent,
    ReorderComponent,
    ReorderinitComponent,
    ShipmentCreationComponent,
    FilterPipe
  ],
  providers: [
    { provide: APP_INITIALIZER, useFactory: appInitializer, multi: true, deps: [AuthenticationService] },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    // provider used to create fake backend
    //fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
