import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })

export class ItemService {
    constructor(private http: HttpClient) { }

  addItem(anItem: ItemList) {
    var url: string = `${environment.apiUrl}/item/AddItem`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<ItemList>(url, anItem, httpOptions);
  }

  getItemList(customer: string) {
    var url: string = `${environment.apiUrl}/item/getitemlist`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    console.log(customer);
    return this.http.post<ItemList[]>(url, { customer: customer }, httpOptions );
  }

  updateItemList(anItem: ItemList) {
    var url: string = `${environment.apiUrl}/item/UpdateItemList`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<ItemList>(url, anItem, httpOptions);
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

