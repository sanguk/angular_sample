import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from '@app/_models';
import { ItemService } from '../../_services/item.service';
import { ShippingService } from '../../_services/shipping.service';
import { ReturnService } from '../../_services/return.service';
import * as XLSX from 'xlsx';
import { IMyOptions } from 'ng-uikit-pro-standard';


@Component({
  templateUrl: './return-list.component.html',
  styleUrls: ['./return-list.component.scss']
})

export class ReturnListComponent {

  @ViewChild('TABLE', { static: false }) TABLE: ElementRef;
  title = 'Excel';
  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'ReturnList.xlsx');
  }

  public myDatePickerOptions: IMyOptions = {
    firstDayOfWeek: 'su' // 'mo' - Monday, 'tu' - Tuesday, 'we' - Wednesday, 'th' - Thursday, 'fr' - Friday, 'sa' - Saturday, 'su' - Sunday
  };

  mainForm;
  elements: any = [];
  total: number;
  locations: string[] = ["All", "AWISEC", "AWICAS"];
  customers: string[] = ["Krave", "ToyoLife", "AWI", "Spigen", "HoneyJarret", "Arencia", "CrossPoint", "Beauteers", "Jayjun", "PeopleLook", "Xuyoni", "ECOEXLAB", "AIONCO", "Looksnmeii", "GAMAGE", "Beauteers1"];



  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,
  private returnService: ReturnService) {}

  ngOnInit() {
    var startAt = new Date(new Date().setHours(0, 0, 0, 0))
    startAt.setMonth(startAt.getMonth() - 1);

    this.mainForm = this.fb.group({
      customer: 'Krave',
      location: 'All',
      //startAt: new Date(2020, 7, 27),
      ////endAt: new Date(2020, 7, 27),
      startAt: startAt,
      endAt: new Date(new Date().setHours(0, 0, 0, 0))
    });
  }

  onSubmit() {
    console.log(this.mainForm.value);
    this.returnService.getRRList(this.mainForm.value).subscribe(data => {
      console.log(data);
      this.elements = data;
    });
  }

  delete(rNo: string) {
    console.log(this.mainForm.get('customer').value, rNo);
    this.returnService.deleteRR(this.mainForm.get('customer').value, rNo).subscribe(response => {
      if (response["isSuccess"] == true) {
        alert(response["errorMsg"]);
      } else {
        alert(response["errorMsg"]);
      }
    });
  }

  gotoRRCreation() {
    this.router.navigate(['/return']);
  }

  gotoReorder(rrno, no) {
    this.router.navigate(['/reorderinit', this.mainForm.get('customer').value, rrno, no]);
  }

  unholdRR(rNo: string) {
    this.returnService.unholdRR(this.mainForm.get('customer').value, rNo).subscribe(response => {
      alert('successfully restock.');

    //  this.onSubmit();
    });
  }

}



