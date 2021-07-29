import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from '@app/_models';
import { BoxService } from '../../_services/box.service';

@Component({ templateUrl: './box-list.component.html' })

export class BoxListComponent {
  mainForm;
  customers: string[] = ["Krave", "ToyoLife", "AWI", "Spigen", "HoneyJarret", "Arencia", "CrossPoint", "Beauteers", "Jayjun", "PeopleLook", "Xuyoni", "ECOEXLAB", "AIONCO", "Looksnmeii", "GAMAGE", "Beauteers1"];
  boxlist: Box[];

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,
  private boxService: BoxService) {
    this.mainForm = fb.group({
      customer: 'Krave'
    });
  }

  onSubmit(formData) {
   
    this.boxService.getBoxList(this.mainForm.get('customer').value)
      .subscribe(data => {
        console.log(this.boxlist);
        this.boxlist = data;
      });
  }

  edit(index): void {
    this.boxlist[index].isEditable = !this.boxlist[index].isEditable;
  }

  add(): void {
    var temp = new Box;
    temp.isEditable = true;
    this.boxlist.unshift(temp);
    console.log(temp);
  }

  update(index): void {
    this.boxlist[index].isEditable = !this.boxlist[index].isEditable;

    if (this.boxlist[index].customer == null) { //add
      this.boxlist[index].customer = this.mainForm.get('customer').value;
      this.boxService.addBox(this.boxlist[index]).subscribe(data => {
        console.log(data);
        alert('successfully added');
      });

    } else { //update
      this.boxService.updateBox(this.boxlist[index]).subscribe(data => {
        console.log(data);
        alert('successfully updated.');
      });
    }
   
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
