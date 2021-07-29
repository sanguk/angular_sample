import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })

export class LabelService {
  constructor(private http: HttpClient) { }

  getLabel(model) {
    var url: string = `${environment.apiUrl}/label/getlabel`;
    return this.http.post(url, model);
  }

  
  

}

