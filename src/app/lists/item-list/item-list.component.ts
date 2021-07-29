import { Component, OnInit, ViewChild, Pipe, PipeTransform, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from '@app/_models';
import { ItemService } from '../../_services/item.service';
import * as XLSX from 'xlsx';


@Component({ templateUrl: './item-list.component.html' })

export class ItemListComponent {

  @ViewChild('TABLE', { static: false }) TABLE: ElementRef;
  title = 'Excel';
  ExportTOExcel() {
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
    XLSX.writeFile(wb, 'ItemList.xlsx');
  }

  searchText: string;
  mainForm;
  itemlist: ItemList[];
  customers: string[] = ["Krave", "ToyoLife", "AWI", "Spigen", "HoneyJarret", "Arencia", "CrossPoint", "Beauteers", "Jayjun", "PeopleLook", "Xuyoni", "ECOEXLAB", "AIONCO", "Looksnmeii", "GAMAGE", "Beauteers1"];


  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,
  private itemService: ItemService) {
    this.mainForm = fb.group({
      customer: 'Krave'
    });
  }

  add(): void {
    var temp = new ItemList;
    this.itemlist.unshift(temp);
  }

  edit(index): void {
    this.itemlist[index].isEditable = !this.itemlist[index].isEditable;
  }

  onSubmit(formData) {
    this.itemService.getItemList(this.mainForm.get('customer').value)
      .subscribe(data => {
        console.log(data);
        this.itemlist = data;
      });
  }

  update(index): void {
    this.itemlist[index].isEditable = !this.itemlist[index].isEditable;


    if (this.itemlist[index].customer == null && this.itemlist[index].id == null) {

      this.itemlist[index].customer = this.mainForm.get('customer').value;
      this.itemService.addItem(this.itemlist[index]).subscribe(data => {
        console.log(data);
        alert('successfully updated');
      });


    } else {

      this.itemService.updateItemList(this.itemlist[index]).subscribe(data => {
        console.log(data);
        alert('successfully updated');
      });
    }

   
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


