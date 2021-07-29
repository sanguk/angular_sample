import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { Shipping } from '../Class';


@Injectable({ providedIn: 'root' })

export class ShippingService {
    constructor(private http: HttpClient) { }

  cancelOrder(shipping) {
    var url: string = `${environment.apiUrl}/shipping/CanceledUpdate`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post(url, shipping, httpOptions);
  }

  closeOrder(shipping) {
    var url: string = `${environment.apiUrl}/shipping/ClosedUpdate`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<Shipping>(url, shipping, httpOptions);
  }

  deleteLabel(shipping) {
    var url: string = `${environment.apiUrl}/shipping/DeleteLabel`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<Shipping>(url, shipping, httpOptions);
  }

  deleteOrder(cus: string, no: number) {
    var url: string = `${environment.apiUrl}/shipping/DeleteOrder`;
    return this.http.post<object>(url, { customer: cus, orderNo: no })
  }

  getFulfilledList(form) {
    var url: string = `${environment.apiUrl}/shipping/fulfilledlist`;
    return this.http.post(url, form);
  }

  getHoldList(form) {
    var url: string = `${environment.apiUrl}/shipping/holdlist`;
    return this.http.post(url, form);
  }

 
  getMaxOrderNo(shippingForm) {
    var url: string = `${environment.apiUrl}/shipping/getMaxOrderNo`;
    return this.http.post(url, shippingForm);
  }

  getMaxOrderNo2(cus) {
    return this.http.get(`${environment.apiUrl}/shipping/GetMaxOrderNoFromQuery?customer=` + cus);
  }
 
  getRestList(model) {
    var url: string = `${environment.apiUrl}/shipping/restlist`;
    return this.http.post(url,model);
  }

  getOrderDetail(cus: string, no: number) {
    var url: string = `${environment.apiUrl}/shipping/orderdetail3/?cus=${cus}&no=${no}`;
    return this.http.get<Shipping>(url);
  }

  getshippingListbyTaskNo(cus, psno) {
    var url: string = `${environment.apiUrl}/shipping/shippinglistbytasknumber/?cus=${cus}&no=${psno}`;
    return this.http.get<Shipping[]>(url);
  }

  getShippinginOrderCreation(cus, orderno) {
    var url: string = `${environment.apiUrl}/shipping/GetShippingInOrderCreation`;
    return this.http.post<Shipping>(url, { customer: cus, orderNo: orderno });
  }

  orderCreation(formdata: object) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    //var url: string = `${environment.apiUrl}/shipping/Add2`; // Add2는 다른데서 사용안한다면 지워주세요 // Add3로 사용할께요.
    var url: string = `${environment.apiUrl}/shipping/Add3`;
    return this.http.post(url, formdata, httpOptions);
  }

  returnMemo(form) {
    return this.http.post(`${environment.apiUrl}/return/memo`, form);
  }

  removeOrderFromTask(cus, orderno) {
    var url: string = `${environment.apiUrl}/shipping/RemoveOrderFromTask`;
    return this.http.post<Shipping>(url, {customer:cus, orderNo: orderno});
  }

  unhold(model) {
    var url: string = `${environment.apiUrl}/shipping/unhold`;
    return this.http.post(url, model);
  }

  updateAddress(shipping) {
    var url: string = `${environment.apiUrl}/shipping/AddressUpdate`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<Shipping>(url, shipping, httpOptions);
  }

  updateTrackingNumber(shipping) {
    var url: string = `${environment.apiUrl}/shipping/TrackingNumberUpdate`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<Shipping>(url, shipping, httpOptions);
  }

  postOrderDetail(cus: string, no: number, cusno: string) {
    var url: string = `${environment.apiUrl}/shipping/orderdetail`;
    return this.http.post<Shipping>(url, { customer: cus, orderNo: no, customerNo: cusno });
  }

  submitShippingForminOrderCreation(shippingForm) {
    var url: string = `${environment.apiUrl}/shipping/Add2`;
    return this.http.post(url, shippingForm);
  }
 
  
}

class ItemList {
  id: string;
  sku: string;
  upc: string;
  upc2: string;
  desc: string;
  weight: number;
  customer: string;
  isEditable: boolean = false;
}

