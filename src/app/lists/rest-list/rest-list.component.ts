import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from '@app/_models';
import { ItemService } from '../../_services/item.service';
import { ShippingService } from '../../_services/shipping.service';
import { TaskService } from '../../_services/task.service';
import * as XLSX from 'xlsx';

@Component({
  templateUrl: './rest-list.component.html',
  styleUrls: ['./rest-list.component.scss']
})

export class RestListComponent {

  @ViewChild('TABLE', { static: false }) TABLE: ElementRef;
  title = 'Excel';
  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'RestList.xlsx');
  }

  mainForm;
  elements: any = [];
  total: number;
  itemlist: ItemList[];
  yesterday = new Date();
  locations: string[] = ["All", "AWISEC", "AWICAS"];
  customers: string[] = ["Krave", "ToyoLife", "AWI", "Spigen", "HoneyJarret", "Arencia", "CrossPoint", "Beauteers", "Jayjun", "PeopleLook", "Xuyoni", "ECOEXLAB", "AIONCO", "Looksnmeii", "GAMAGE", "Beauteers1"];
  checkedlist: string[] = [];
  mastercheck: boolean = false;
  atask: any;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,
    private itemService: ItemService, private shippingService: ShippingService,
    private taskService: TaskService) {
    this.mainForm = fb.group({
      customer: 'Krave',
      location: 'All'
    });
  }

  ngOnInit() {
    this.yesterday.setDate(this.yesterday.getDate() - 1);
  }

  createCheckedList(value: any, id: string) {
    //  console.log(value);
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
    //console.log(this.elements[index].paidAt);
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
    this.shippingService.getRestList(this.mainForm.value)
      .subscribe(data => {
        this.elements = data;
        this.total = (data as object[]).length;
        console.log('done search');
      });
  }

  passthelist() {
    for (let i = 0; i < this.checkedlist.length; i++) {
      for (let j = 0; j < this.elements.length; j++) {
        if (this.checkedlist[i] == this.elements[j].id && this.elements[j].packingSlipPrint != null) {
          alert('At least one of the checked items has a task number.');
          return;
        }
      }
    }

    if (this.mainForm.get('location').value == "All") {
      alert('The location should either AWISEC or AWICAS. Please select.');
      return;
    } else if (this.checkedlist.length == 0) {
      alert('No selected orders.');
      return;
    } else {
      this.taskService.createTasks(this.checkedlist,
        this.mainForm.get('customer').value,
        this.mainForm.get('location').value)
        .subscribe(data => {
            this.atask = data;

        if (this.mainForm.get('customer').value == "PeopleLook" ||
          this.mainForm.get('customer').value == "Xuyoni" ||
          this.mainForm.get('customer').value == "ECOEXLAB") {
            let ordernolist: Number[] = [];
            for (let i = 0; i < this.elements.length; i++) {
              if (this.checkedlist.includes(this.elements[i].id)) {
                ordernolist.push(this.elements[i].orderNo);
              }
            }

            this.taskService.generatePackingSlipV3(ordernolist, this.mainForm.get('customer').value)
              .subscribe(data => {
                alert('task generated at #' + this.atask.packingSlipPrint);
              });
          } else {
            alert('task generated at #' + this.atask.packingSlipPrint);
          }

      }, data => {
        alert('task generat failed.');
      }, () => {
      });
    }
  }

  test() {
    this.mastercheck = !this.mastercheck;
    this.checkedlist = [];
    if (this.mastercheck == true) {
      for (let i = 0; i < this.elements.length; i++) {
        this.elements[i].checked = this.mastercheck;
        this.checkedlist.push(this.elements[i].id);
      }
    }

    else if (this.mastercheck == false) {
      for (let i = 0; i < this.elements.length; i++) {
        this.elements[i].checked = this.mastercheck;
      }
    }
    console.log(this.checkedlist);
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


