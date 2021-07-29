import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })

export class ReturnService {
  constructor(private http: HttpClient) { }

  deleteRR(cus, rNo) {
    var url: string = `${environment.apiUrl}/return/DeleteRR`;
    return this.http.post(url, {customer: cus, rMANo: rNo});
  }

  getRestockList(formData) {
    var url: string = `${environment.apiUrl}/return/GetRestockedList`;
    return this.http.post(url, formData);
  }

  getRRList(formData) {
    var url: string = `${environment.apiUrl}/return/GetRRList`;
    return this.http.post(url, formData);
  }

  getReturnReceivingwithrma(cus, rma) {
    var url: string = `${environment.apiUrl}/return/GetReturnReceiving`;
    return this.http.post(url, { customer: cus, rMANo: rma });
  }

  getReturnReceivingwithloc(cus, loc) {
    var url: string = `${environment.apiUrl}/return/GetReturnReceiving`;
    return this.http.post(url, { customer: cus, location: loc });
  }

  postReturnReceiving(receivingOrshipping) {
    var url: string = `${environment.apiUrl}/return/PostReturnReceiving`;
    return this.http.post(url, receivingOrshipping);
  }

  unholdRR(cus, rma) {
    var url: string = `${environment.apiUrl}/return/UnHold`;
    return this.http.post(url, { customer: cus, rMANo: rma });
  }
  

}

