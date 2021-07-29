import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { AdminComponent } from './admin';
import { LoginComponent } from './login';
import { AuthGuard } from './_helpers';
import { BoxListComponent } from './lists/box-list/box-list.component';
import { ItemListComponent } from './lists/item-list/item-list.component';
import { RestListComponent } from './lists/rest-list/rest-list.component';
import { OrderDetailComponent } from './details/orderdetail.component';
import { OrderDetailOnManuComponent } from './details/orderdetailonmanu/orderdetailonmanu.component';

import { PackingSlipListComponent } from './details/packingsliplist/packingsliplist.component';
import { FulfilledListComponent } from './lists/fulfilled-list/fulfilled-list.component';
import { TaskListComponent } from './task/task-list/task-list.component';
import { ReturnListComponent } from './lists/return-list/return-list.component';
import { RestockedListComponent } from './lists/restocked-list/restocked-list.component';
import { HoldListComponent } from './lists/hold-list/hold-list.component';
import { PackingComponent } from './packing/packing.component';
import { ReturnComponent } from './return/return.component';
import { OrderCreationComponent } from './order-creation/order-creation.component';
import { ReorderComponent } from './order-creation/reorder/reorder.component';
import { ReorderinitComponent } from './order-creation/reorderinit/reorderinit.component';
import { ShipmentCreationComponent } from './shipment-creation/shipment-creation.component';

import { Role } from './_models';

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard],
        data: { roles: [Role.Admin] }
    },
  { path: 'login',component: LoginComponent},
  { path: 'box-list', component: BoxListComponent },
  { path: 'item-list', component: ItemListComponent },
  { path: 'rest-list', component: RestListComponent },
  { path: 'fulfilled-list', component: FulfilledListComponent },
  { path: 'task-list', component: TaskListComponent },
  { path: 'return-list', component: ReturnListComponent },
  { path: 'restocked-list', component: RestockedListComponent },
  { path: 'hold-list', component: HoldListComponent },
  { path: 'individualshipping/:cus/:no', component: OrderDetailComponent },
  { path: 'orderdetail', component: OrderDetailOnManuComponent },
  { path: 'task/:cus/:no', component: PackingSlipListComponent },
  { path: 'packing/:cus/:no', component: PackingComponent },
  { path: 'return', component: ReturnComponent },
  { path: 'order-creation', component: OrderCreationComponent },
  { path: 'reorder', component: ReorderComponent },
  { path: 'reorderinit/:cus/:rrno/:no', component: ReorderinitComponent },
  { path: 'shipment-creation', component: ShipmentCreationComponent },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
