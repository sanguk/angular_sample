import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })

export class PackingService {
  constructor(private http: HttpClient) { }

  completePacking(cus, strShippingInfo) {
    var url: string = `${environment.apiUrl}/packing/CompletedPacking`;
    return this.http.post<object[]>(url, { customer: cus, strShippingInfo: strShippingInfo });
  }

  generateLabel(cus, orderno) {
    var url: string = `${environment.apiUrl}/packing/generateLabel`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    return this.http.post<object[]>(url, { customer: cus, orderNo: Number(orderno) }, httpOptions);
  }

  getRMATicket(cus, orderno) {
    var url: string = `${environment.apiUrl}/packing/getRMATicket`;
    return this.http.post<object[]>(url, { customer: cus, orderNo: orderno });
  }

  getShipping(cus: string, orderno: string) {
    var url: string = `${environment.apiUrl}/packing/GetShipping`;
    return this.http.post<object[]>(url, { customer: cus, orderNo: orderno});
  }

  unsetPackingSlipEndAt(cus, orderno) {
    var url: string = `${environment.apiUrl}/packing/UnsetPackingSlipEndAt`;
    return this.http.post<object[]>(url, { customer: cus, orderNo: Number(orderno) });
  }
  

}

