import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ShippingService } from '../../_services/shipping.service';

@Component({
  selector: 'app-hold-list',
  templateUrl: './hold-list.component.html',
  styleUrls: ['./hold-list.component.scss']
})

export class HoldListComponent {
  elements: any = [];
  checkedList: any = [];
  total: number;

  masterSelected: boolean = false;

  mainForm;

  locationOptionsSelect: object[] = [
    { value: 'All', label: 'All' },
    { value: 'AWICAS', label: 'AWICAS' },
    { value: 'AWISEC', label: 'AWISEC' },
    { value: 'NotAssigned', label: 'NotAssigned' },
  ];

  constructor(
    //public datepipe: DatePipe,
    private fb: FormBuilder, private http: HttpClient, private router: Router,
    private shippingService: ShippingService) { }

  ngOnInit() {
    this.mainForm = this.fb.group({
      location: 'All',
      page: 1
    });

    this.onSubmit(this.mainForm);
  }

  onSubmit(customerData) {
    //console.warn(customerData);
    if (this.mainForm.valid) {
      this.shippingService.getHoldList(this.mainForm.value).subscribe(data => {
        console.log(data);
        this.elements = data;
        //this.total = data["total"];
        //alert('done search');
      });

    }
    else {
      alert(this.mainForm.status);
    }

    //this.checkoutForm.reset();
  }

  allCheckClicked() {
    console.log('allCheckClicked');
    for (var i = 0; i < this.elements.length; i++) {
      this.elements[i].isSelected = this.masterSelected;
    }
    this.getCheckedItemList();
  }

  getCheckedItemList() {
    this.checkedList = [];
    for (var i = 0; i < this.elements.length; i++) {
      if (this.elements[i].isSelected)
        this.checkedList.push(this.elements[i]);
    }
    //console.log(JSON.stringify(this.checkedList));
    //this.checkedList = JSON.stringify(this.checkedList);
  }

  //api/shipping/unhold
  unHold(customer, orderno) {
    var Rmodel = new modelone();
    Rmodel.customer = customer;
    Rmodel.orderno = orderno;

    this.shippingService.unhold(Rmodel).subscribe(data => {
      alert('unhold success');
      this.onSubmit(null);
    });
  }
}

class modelone {
  customer: string
  orderno: number
}
