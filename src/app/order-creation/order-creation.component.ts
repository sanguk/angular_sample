import { Component, HostListener, ViewChild, OnInit, Input, ElementRef, EventEmitter } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { Shipping, Package, ItemQty, Box, Address, SimpleLabel } from '../Class';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { delay, switchMap, map, tap } from 'rxjs/operators';
import { Time } from '@angular/common';
import { Router } from '@angular/router';
import { ItemService } from '../_services/item.service';
import { ShippingService } from '../_services/shipping.service';

@Component({
  templateUrl: './order-creation.component.html',
  styleUrls: ['./order-creation.component.scss']
})

export class OrderCreationComponent {

  customers: string[] = ["Krave", "ToyoLife", "AWI", "Spigen", "HoneyJarret", "Arencia", "CrossPoint", "Beauteers", "Beauteers1", "Jayjun", "PeopleLook", "Xuyoni", "ECOEXLAB", "GAMAGE", "AIONCO", "Looksnmeii", "GAMAGE", "Beauteers1"];
  locations: string[] = ["AWISEC", "AWICAS"];
  carriers: string[] = ["Endicia", "FedEx"];
  endishippingopt: string[] = ["First", "Priority"];
  fedshippingopt: string[] = ["FEDEX_2_DAY", "FEDEX_GROUND", "SMART_POST"];
  address: Address = new Address;
  itemlist: ItemList[];
  MaxOrderNo: number;
  index: number;
  shippingForm;


  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,
  private itemService: ItemService, private shippingService: ShippingService) {

    this.shippingForm = fb.group({
      customer: ['Krave'],
      customerno: '',
      orderno: Number,
      neworderno: 0,
      parentorderno: Number,
      location: '',

      items: this.fb.array([
        this.additem()
      ]),

      shipTo: [new Address("US")],

      labels: this.fb.array([
        this.addlabel()
      ]),

      isChargeToCustomer: []
    });

     this.shippingService.getMaxOrderNo(this.shippingForm.value).subscribe(data => {
       this.MaxOrderNo = data as number + 1;
       this.shippingForm.get('neworderno').setValue(this.MaxOrderNo);
    });
  }

  isManual: boolean = false;

  loadinfo(formdata): void {
   // this.clearFormArray(this.shippingForm.get('items'));

    this.itemService.getItemList(this.shippingForm.get('customer').value).subscribe(data => {
      this.itemlist = data;
      console.log(this.itemlist);
    });

    if (this.shippingForm.get('orderno').value > 0) {

      this.shippingService.getShippinginOrderCreation(
        this.shippingForm.get('customer').value,
        this.shippingForm.get('orderno').value).subscribe(data1 => {
          console.log(data1);
          if (data1 == null) { // Manual order
            let newcustomerno = "M" + this.shippingForm.get('neworderno').value.toString();
            this.shippingForm.get('customerno').setValue(newcustomerno);
            this.isManual = true;
            //this.shippingForm.get('location').setValue("AWISEC");
          } else { // Reorder
            console.log(data1);
            console.log(data1.customerNo);

            if (data1.parentOrderNo == this.shippingForm.get('orderno').value) {
              alert('The Order has created a reorder of #' + data1.orderNo);
              location.reload(); 0
              return;
            }

            this.shippingForm.get('parentorderno').setValue(data1.orderNo);
            this.shippingForm.get('customerno').setValue(`R${data1.customerNo}`);
            if (data1.location == null) {
              alert('Error:The original order has the empty Location.');
              return;
            }
            this.shippingForm.get('location').setValue(data1.location);
            //this.shippingForm.get('labels').setValue(data.labels);
            //if (this.shippingForm.get('orderno').value > 39999999) {
            //  this.shippingForm.get('orderno').setValue(this.OrderNo);
            //}
            this.shippingForm.get('shipTo').setValue(data1.shipTo);

            for (let i = 0; i < data1.items.length; i++) {
              this.items[i].sku = data1.items[i].sku;
              let n = this.itemlist.findIndex(j => j.sku == this.items[i].sku);
              if (n > -1) {
                this.items[i].desc = this.itemlist[n].desc;
              }
              console.log(n);

              this.items[i].qty = data1.items[i].qty;
              console.log('added an item');
              this.add();
            }

            this.delete(this.items.length - 1);
            console.log('after loading', this.shippingForm.get('items').value);
          }
        });
    } else {
      console.log('order no is 0');
      let newcustomerno = "M" + this.shippingForm.get('neworderno').value.toString();
      this.shippingForm.get('customerno').setValue(newcustomerno);
      this.isManual = true;
    }
   
  }

  customerchange(): void {
    this.shippingService.getMaxOrderNo(this.shippingForm.value).subscribe(data => {
      this.MaxOrderNo = data as number + 1;
      this.shippingForm.get('neworderno').setValue(this.MaxOrderNo);
    });
  }

  ordernumberchange(): void {
    this.clearFormArray(this.shippingForm.get('items'));
    console.log(this.items);
  }

  clearFormArray = (formarr: FormArray) => {
    while (formarr.length !== 0) {
      formarr.removeAt(0)
    }
    this.add();
  }

  add(): void {
    (<FormArray>this.shippingForm.get('items')).push(this.additem());
  }

  additem(): FormGroup {
    return this.fb.group({
      sku: ['', Validators.required],
      desc: [''],
      qty: [Number],
      fulfillableQty: [Number]
    })
  }

  addlabel(): FormGroup {
    return this.fb.group({
      IsSignature: [Boolean],
      IsCertified: [Boolean],
      Carrier: String,
      ShippingOption: String
    })
  }

  delete(index): void {
    this.items.splice(index, 1);
    console.log(this.shippingForm.get('items').value);
  }

  submit(): void {
    
    if (this.shippingForm.get('location').value == "") {
      alert('Please select a shipping location');
      return;
    }

    if (this.shipTo.country != "US") {
      alert('Country should be US');
      return;
    }

    for (let i = 0; i < this.items.length; i++) {
      this.items[i].fulfillableQty = this.items[i].qty;
    }

    //if (this.isManual) {
    this.shippingForm.get('items').setValue(this.items);
      console.log(this.shippingForm.value);
      this.shippingService.submitShippingForminOrderCreation(this.shippingForm.value)
        .subscribe(data => {
          if (data == 0) {
            alert('order # duplicates');
          } else if (data == 1) {
            alert('successrully order added at #' + this.shippingForm.get('neworderno').value);
          }
          location.reload();
        });
   // } else {
   //   console.log('is not manual but reorder');
   //   console.log(this.shippingForm.value);
   // }

   
  }


  get shipTo(): Address {
    return this.shippingForm.get('shipTo').value as Address;
  }

  get labels(): Array<SimpleLabel> {
    return this.shippingForm.get('labels').value as Array<SimpleLabel>;
  }

  get items(): Array<Item> {
    return this.shippingForm.get('items').value as Array<Item>;
  }


  selectSku(iteminfo, qty) {
    console.log(iteminfo, qty);
    console.log(this.items.length);
    this.index = this.itemlist.findIndex(i => i.sku == iteminfo);//this.items[this.items.length - 1].sku);
    console.log(this.index);
    this.items[this.items.length - 1].desc = this.itemlist[this.index].desc;
    this.items[this.items.length - 1].qty = qty;
    console.log(this.items);

  }

  selectDesc(iteminfo, qty) {
    this.index = this.itemlist.findIndex(i => i.desc == iteminfo);
    this.items[this.items.length - 1].sku = this.itemlist[this.index].sku;
    this.items[this.items.length - 1].qty = qty;
    console.log(this.index);
    console.log(this.items);
  }

  public statelist = [
    { name: "Alabama" }, { name: 'Alaska' }, { name: 'Arizona' },
    { name: 'Arkansas' }, { name: 'California' }, { name: 'Colorado' },
    { name: 'Connecticut' }, { name: 'Delaware' }, { name: 'Florida' },
    { name: 'Georgia' }, { name: 'Hawaii' }, { name: 'Idaho' },
    { name: 'Illinois' }, { name: 'Indiana' }, { name: 'Iowa' },
    { name: 'Kansas' }, { name: 'Kentucky' }, { name: 'Louisiana' },
    { name: 'Maine' }, { name: 'Maryland' }, { name: 'Massachusetts' },
    { name: 'Michigan' }, { name: 'Minnesota' }, { name: 'Mississippi' },
    { name: 'Missouri' }, { name: 'Montana' }, { name: 'Nebraska' },
    { name: 'Nevada' }, { name: 'New Hampshire' }, { name: 'New Jersey' },
    { name: 'New Mexico' }, { name: 'New York' }, { name: 'North Carolina' },
    { name: 'North Dakota' }, { name: 'Ohio' }, { name: 'Oklahoma' },
    { name: 'Oregon' }, { name: 'Pennsylvania' }, { name: 'Rhode Island' },
    { name: 'South Carolina' }, { name: 'South Dakota' }, { name: 'Tennessee' },
    { name: 'Texas' }, { name: 'Utah' }, { name: 'Vermont' },
    { name: 'Virginia' }, { name: 'Washington' }, { name: 'AWest Virginia' },
    { name: 'Wisconsin' }, { name: 'Wyoming' }
  ]

}

class Item {
  sku: string;
  desc: string;
  qty: number;
  fulfillableQty: number;
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

class Label {
  CustomerId: string;
  Type: string;
  carrier: string;
  ShippingOption: string;
  isSignature: boolean;
  isCertified: boolean;
  CreatedAt: Time;
  TransactionID: string;
  trackingNo: string;
  Price: number;
  AdjustPrice: number;
  RefundPrice: number;
  Image: string;
  EstimateAt: Time;
  ShipOutAt: Time;
  //DeliveryAt: Time;
}


