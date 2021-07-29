import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from '@app/_models';
import { Time } from '@angular/common';
import { ShippingService } from '../../_services/shipping.service';
import { TaskService } from '../../_services/task.service';
import * as XLSX from 'xlsx';

@Component({
  templateUrl: './packingsliplist.component.html',
  styleUrls: ['./packingsliplist.component.scss']
})

export class PackingSlipListComponent {
  elements: any = [];
  total: number;
  filters: Filter[] = [];
  checkedlist: string[] = [];

  constructor(private http: HttpClient, private router: Router,
    private _ActivatedRoute: ActivatedRoute, private shippingService: ShippingService,
    private taskService: TaskService) { }

  sub;
  cus;
  no;

  @ViewChild('input1') inputEl1: ElementRef;
  @ViewChild('TABLE', { static: false }) TABLE: ElementRef;
  title = 'Excel';

  changeIndividualLocation(value: any, id: string) {
    if (value.currentTarget.checked == true) {
      this.checkedlist.push(id);
    }
    if (value.currentTarget.checked == false) {
      const index: number = this.checkedlist.indexOf(id);
      if (index !== -1) {
        this.checkedlist.splice(index, 1);
      }
    }
    for (let i = 0; i < this.checkedlist.length; i++) {
      console.log(this.checkedlist[i]);
    }
  }


  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, `TaskList_${this.no}.xlsx`);
  }

  ngOnInit() {
    this.sub = this._ActivatedRoute.paramMap.subscribe(params => {
      this.cus = params.get('cus');
      this.no = params.get('no');

      this.shippingService.getshippingListbyTaskNo(this.cus, this.no).subscribe(data => {
        this.elements = data["list"];
        this.total = data["total"];
        console.log(data);
      });
    });

    setTimeout(() => this.inputEl1.nativeElement.focus(), 300);
  }

  OrderNoList: number[] = [];
  generateV3Label() {
  //  console.log(this.elements[0]);
    for (let i = 0; i < this.elements.length; i++) {
      this.OrderNoList.push(this.elements[i].orderNo);
      if (this.elements[i].packingSlipPrintAt != null) {
        alert('Fail: At least one of the packingSlips has been printed.');
        return;
      }
    }
    //  console.log(this.OrderNoList);
    this.taskService.generatePackingSlipV3(this.cus, this.OrderNoList).subscribe(data => {
      alert('V3 Labels are generaged.');
    });
  }

  onSearchChange(searchValue: string) {
    this.router.navigate(['/packing', this.cus, searchValue]);
  }

  passthecheckedlist() {
    if (this.checkedlist.length == 0) {alert('No selected orders.'); return;}

    const loc = this.elements[0].location;
    for (let i = 0; i < this.checkedlist.length; i++) {
      for (let j = 0; j < this.elements.length; j++) {
        if (this.checkedlist[i] == this.elements[j].id && this.elements[j].packingEndAt != null) {
          alert('Fail: At least one of the checked items has been packed.');
          return;
        }

        if (this.checkedlist[i] == this.elements[j].id && this.elements[j].closedAt != null) {
          alert('Fail: At least one of the checked items has been closed.');
          return;
        }
      }
    }

    console.log(this.checkedlist);
    this.taskService.changeIndividualTaskLocation(this.cus, loc, this.checkedlist).subscribe(data => {
      console.log(data);
      if (data == 1) {
        alert('successfully moved.');
      } else {
        alert('fail to move.');
      }
    });
   
  }

 
  removeOrder(orderno: number) {
    console.log(orderno);

    var targetorder = this.elements.find(a => a.orderNo == orderno);
    console.log(targetorder);

    if (targetorder.labels || targetorder.labels != null) {

      if (targetorder.labels.length > 0 && targetorder.labels[0].trackingNo != null) {
        alert('Cannot remove this order from the task: The label has been created.');
      } else {
        this.shippingService.removeOrderFromTask(targetorder.customer, targetorder.orderNo).subscribe(data => {
          alert('order removed');
        });
      }
    }

    else if (targetorder.packingEndAt != null) {
      alert('Cannot cancel: The items have been packed.');
    }

    else {
      this.shippingService.removeOrderFromTask(targetorder.customer, targetorder.orderNo).subscribe(data => {
        alert('order removed');
      });
    }
  }
  

}

class Filter {
  sku: string;
  qty: number;
}
