import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })

export class TaskService {
  constructor(private http: HttpClient) { }

  createTasks(idlist, cus, loc) {
    var url: string = `${environment.apiUrl}/task/CreateTasks`;
    return this.http.post(url, { idList: idlist, Customer: cus, Location: loc });
  }

  changeIndividualTaskLocation(cus, location, idlist) {
    var url: string = `${environment.apiUrl}/task/ChangeIndividualLocation`;
    return this.http.post(url, { Customer: cus, Location: location, idList: idlist });
  }

  changeTasksLocation(cus, psnumber, location) {
    var url: string = `${environment.apiUrl}/task/ChangeTasksLocation`;
    return this.http.post(url, { Customer: cus, packingSlipPrint: psnumber, location: location } );
  }

  getTaskList(form) {
    var url: string = `${environment.apiUrl}/task/GetTaskList`;
    return this.http.post(url, form);
  }

  getPackingSlipList(cus, psnumber) {
    var url: string = `${environment.apiUrl}/task/GetPackingSlip`;
    return this.http.post(url, { Customer: cus, packingSlipPrint: psnumber });
  }

  generatePackingSlipV3(orderlist, cus) {
    var url: string = `${environment.apiUrl}/task/GeneratePackingSlipV3`;
    return this.http.post(url, { Customer: cus,OrderNoList: orderlist });
  }

}

