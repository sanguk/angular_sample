import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from '@app/_models';
import { ShippingService } from '../../_services/shipping.service';
import { TaskService } from '../../_services/task.service';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';

declare function print_zpl(zpl: string): void;

@Component({
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})

export class TaskListComponent {

  @ViewChild('TABLE', { static: false }) TABLE: ElementRef;
  title = 'Excel';
  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'TaskList.xlsx');
  }

  mainForm;
  elements: any = [];
  total: number;
  locations: string[] = ["All", "AWISEC", "AWICAS"];
  customers: string[] = ["Krave", "ToyoLife", "AWI", "Spigen", "HoneyJarret", "Arencia", "CrossPoint", "Beauteers", "Jayjun", "PeopleLook", "Xuyoni", "ECOEXLAB", "AIONCO", "Looksnmeii", "GAMAGE", "Beauteers1"];

  constructor(
    private fb: FormBuilder, private http: HttpClient, private router: Router,
    private shippingService: ShippingService,
    private taskService: TaskService) {
    this.mainForm = fb.group({
      customer: 'Krave',
      location: 'All',
      page: 1
    });
  }

  changeLocation(cus: string, psnumber: number, location: string) {
    this.taskService.changeTasksLocation(cus, psnumber, location).subscribe(data => {
      if (data == 1) {
        alert('task moved.');
      } else {
        alert('fail to move the task: plase check if packed, closed, or cancelled.');
      }
    });
  }

  onSubmit(formData) {
    this.taskService.getTaskList(this.mainForm.value)
      .subscribe(data => {
        this.elements = data["list"];
        this.total = data["total"];
        console.log('done search');
      });
  }

  printPackingSlipAll(cus: string, psnumber: number) {
    this.taskService.getPackingSlipList(cus, psnumber).subscribe(response => {
      console.log(response);
      if (response["isSuccess"]) {
        for (var i = 0; i < response["data"].length; i++) {
          print_zpl(response["data"][i].toString());
        }
        alert('done printPackingSlipAll');
      } else {
        alert(response["errorMsg"]);
      }
    });
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


