import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })

export class BoxService {
    constructor(private http: HttpClient) { }

  getBoxList(customer: string) {
    var url: string = `${environment.apiUrl}/box/getboxlist`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };

    console.log(customer);
    return this.http.post<Box[]>(url, { customer: customer }, httpOptions );
  }

  addBox(aBox: Box) {
    var url: string = `${environment.apiUrl}/box/add`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<Box>(url, aBox, httpOptions);
  }

  updateBox(aBox: Box) {
    var url: string = `${environment.apiUrl}/box/update`;

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this.http.post<Box>(url, aBox, httpOptions);
  }




}

class Box {
  type: string;
  name: string;
  width: number;
  height: number;
  length: number;
  weight: number;
  customer: string;
  isEditable: boolean;
  createdby: string;
  updatedby: string;
}
