import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from '@app/_models';
import { ItemService } from '../../_services/item.service';
import { ShippingService } from '../../_services/shipping.service';
import * as XLSX from 'xlsx';
import { IMyOptions } from 'ng-uikit-pro-standard';


@Component({
  templateUrl: './fulfilled-list.component.html',
  styleUrls: ['./fulfilled-list.component.scss']
})

export class FulfilledListComponent {

  @ViewChild('TABLE', { static: false }) TABLE: ElementRef;
  title = 'Excel';
  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'FulfilledList.xlsx');
  }

  public myDatePickerOptions: IMyOptions = {
    firstDayOfWeek: 'su' // 'mo' - Monday, 'tu' - Tuesday, 'we' - Wednesday, 'th' - Thursday, 'fr' - Friday, 'sa' - Saturday, 'su' - Sunday
  };

  mainForm;
  elements: any = [];
  total: number;
  itemlist: ItemList[];
  yesterday = new Date();
  locations: string[] = ["All", "AWISEC", "AWICAS"];
  customers: string[] = ["Krave", "ToyoLife", "AWI", "Spigen", "HoneyJarret", "Arencia", "CrossPoint", "Beauteers", "Jayjun", "PeopleLook", "Xuyoni", "ECOEXLAB", "AIONCO", "Looksnmeii", "GAMAGE", "Beauteers1"];
  checkedlist: string[] = [];
  mastercheck: boolean = false;

//  filters: Filter[] = [];
  ifFilter: boolean = false;
  filterred: any[];

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,
  private itemService: ItemService, private shippingService: ShippingService) {
    this.mainForm = fb.group({
      customer: 'Krave',
      location: 'All',
      startAt: new Date(new Date().setHours(0, 0, 0, 0)),
      endAt: new Date(new Date().setHours(0, 0, 0, 0)),
    });
  }

  ngOnInit() {
    this.yesterday.setDate(this.yesterday.getDate() - 1);
  }

  createCheckedList(value: any, id: string) {
    for (let i = 0; i < this.checkedlist.length; i++) {
      console.log(this.checkedlist[i]);
    }

    if (value.currentTarget.checked == true) {
      this.checkedlist.push(id);
    }
    if (value.currentTarget.checked == false) {
      const index: number = this.checkedlist.indexOf(id);
      if (index !== -1) {
        this.checkedlist.splice(index, 1);
      }
    }
    console.log(this.checkedlist);
  }


  isEarlierthanYesterday(index: number): boolean {
    let elpaid = new Date(this.elements[index].paidAt);
    let paidyear = elpaid.getFullYear();
    let paidmonth = elpaid.getMonth();
    let paiddate = elpaid.getDate();
    if ((paidmonth <= this.yesterday.getMonth() && paiddate <= this.yesterday.getDate()) || (paidyear < this.yesterday.getFullYear()) ||
      (paidmonth < this.yesterday.getMonth() && paiddate >= this.yesterday.getDate())) {
      return true;
    } else {
      return false;
    }
  }


  onSubmit(formData) {
    console.log(formData);
    this.shippingService.getFulfilledList(formData)
    .subscribe(data => {
        this.elements = data;
        this.total = this.elements.length;
      console.log(this.elements);
      });
  
    this.filterred = [];
  //  this.filters = [];
  //  this.addFilterRows();
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


