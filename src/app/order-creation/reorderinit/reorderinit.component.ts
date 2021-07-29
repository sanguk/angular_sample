import { Component, HostListener, ViewChild, OnInit, Input, ElementRef, EventEmitter } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators, FormArray, ValidationErrors, AbstractControl, NgModel, NgControl } from '@angular/forms';
import { Shipping, Package, ItemQty, Box, Address, SimpleLabel, Item } from '../../Class';
import { Observable, BehaviorSubject, from } from 'rxjs';
import { delay, switchMap, map, tap } from 'rxjs/operators';
import { Time } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService, AuthenticationService } from '@app/_services';
import { ItemService } from '../../_services/item.service';
import { ShippingService } from '../../_services/shipping.service';

@Component({
  templateUrl: './reorderinit.component.html',
  styleUrls: ['./reorderinit.component.scss']
})

export class ReorderinitComponent {

  locations: string[] = ["AWISEC", "AWICAS"]
  carriers: string[] = ["Endicia", "FedEx"]
  endishippingopt: string[] = ["First", "Priority"]
  fedshippingopt: string[] = ["FEDEX_2_DAY", "FEDEX_GROUND", "SMART_POST"]
  reasons: string[] = ["Missing", "Delay", "Preshipment", "RTS", "Missing Items"]
  address: Address = new Address;
  itemlist: ItemList[];
  MaxOrderNo: number;
  index: number;
  shippingForm;
  memoForm;
  isManual: boolean = false;
  tempitems: Item[];

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private shippingService: ShippingService,
    private itemService: ItemService,
    private _ActivatedRoute: ActivatedRoute,
    private authenticationService: AuthenticationService) {

  }

  sub;
  cus;
  no;
  rrno;

  ngOnInit() {
    const currentUser = this.authenticationService.userValue;

    this.sub = this._ActivatedRoute.paramMap.subscribe(params => {
      this.cus = params.get('cus');
      this.no = params.get('no');
      this.rrno = params.get('rrno');

    });



    this.shippingForm = this.fb.group({
      customer: this.cus,
      customerno: '',
      orderno: this.no,
      neworderno: 0,
      parentorderno: Number,
      location: '',
      items: this.fb.array([

      ]),

      shipTo: new Address(),

      labels: this.fb.array([
        this.addlabel()
      ]),

      isChargetoCustomer: true,
      content: ['']
    })

    this.shippingService.getMaxOrderNo2(this.cus)
      .subscribe(data => {
        this.MaxOrderNo = data as number + 1;
        this.shippingForm.get('orderno').setValue(this.MaxOrderNo);
      });

    this.itemService.getItemList(this.cus)
      .subscribe(data => {
        this.itemlist = data as ItemList[];
        console.log(this.itemlist);
      });

    this.loadinfo();
  }

  submit() {
    console.log(this.tempitems.length);
    console.log('submit before',this.shippingForm.value);
    
    for (let i = 0; i < this.tempitems.length; i++) {
      (<FormArray>this.shippingForm.get('items'))
        .push(this.fb.group({
          sku: this.tempitems[i].sku,
          desc: this.tempitems[i].desc,
          qty: this.tempitems[i].qty,
          fulfillableQty: this.tempitems[i].qty
        }));
    }

    this.shipTo.setValue(this.address);
    console.log('submit after',this.shippingForm.value);
    

    this.shippingService.orderCreation(this.shippingForm.value)
      .subscribe(data => {
        if (data['isSuccess'] == true) {
          const currentUser = this.authenticationService.userValue;
          this.memoForm = this.fb.group({ customer: this.cus, receivedNo: this.rrno, content: 'reorder created by ' + currentUser.username });
          console.log(this.memoForm.value);
          this.shippingService.returnMemo(this.memoForm.value)
            .subscribe(response => {
              console.log(response);
            });

          alert('successfully created at order # ' + this.MaxOrderNo);
        } else {
          alert('fail to create the reorder');
          console.log(data);
        }
        this.ngOnInit();
        this.tempitems = [];
      });

  }


  loadinfo(): void {

    this.shippingService.getOrderDetail(this.cus, this.no)
      .subscribe(data => {

        if (data == null) { // Manual order
          this.isManual = true;
        }
        else { // Reorder
          console.log(data);
            this.shippingForm.get('customerno').setValue('R' + data.customerNo);
            this.shippingForm.get('parentorderno').setValue(data.orderNo);
            this.shippingForm.get('orderno').setValue(this.MaxOrderNo);
            this.shippingForm.get('location').setValue(data.location);
            this.address = data.shipTo;
            this.tempitems = data.items;

            for (let i = 0; i < this.tempitems.length; i++) {
              let n = this.itemlist.findIndex(j => j.sku == this.tempitems[i].sku);
              if (n > -1) {
                this.tempitems[i].desc = this.itemlist[n].desc;
              }

          }
          console.log('submit before0', this.shippingForm.value);
          }
        
          
        
      });
    
  }

  get shipTo() {
    return this.shippingForm.get('shipTo');
  }

  addlabel(): FormGroup {
    return this.fb.group({
      IsSignature: [Boolean],
      IsCertified: [Boolean],
      Carrier: String,
      ShippingOption: String
    })
  }

  ordernumberchange(): void {
    console.log('changed');
    this.clearFormArray(this.shippingForm.get('items'));
    console.log(this.items);
  }

  clearFormArray = (formarr: FormArray) => {
    while (formarr.length !== 0) {
      formarr.removeAt(0)
    }
    this.add();
  }

  get labels(): Array<SimpleLabel> {
    return <Array<SimpleLabel>>this.shippingForm.get('labels').value as Array<SimpleLabel>;
  }

  whichCarrier(index: number): string {
    if (this.labels[index].Carrier == 'Endicia') {
      return 'Endicia';
    }
    if (this.labels[index].Carrier == 'FedEx') {
      return 'FedEx';
    }
  }

  get items(): Array<Item> {
    return this.shippingForm.get('items') as Array<Item>;
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

  addlist() {
    this.tempitems.push(new Item);
  }

  delete(index): void {
    this.items.splice(index, 1);
    console.log(this.items);
  }

  deletelist(index): void {
    this.tempitems.splice(index, 1);
    console.log(this.tempitems);
  }

  selectSku(index: number) {
    this.index = this.itemlist.findIndex(i => i.sku == this.tempitems[index].sku);
    this.tempitems[index].desc = this.itemlist[this.index].desc;
  //  this.shippingForm.setControl('items', this.setDesc(this.tempitems));
  }

  setDesc(item: Item[]): FormArray {
    const formArray = new FormArray([]);
    item.forEach(i => {
      formArray.push(this.fb.group({
        sku: i.sku,
        desc: i.desc,
        qty: i.qty,
        fulfillableQty: i.fulfillableQty
      }));
    });
    return formArray;
  }

  selectDesc(index:number) {
    this.index = this.itemlist.findIndex(i => i.desc == this.tempitems[index].desc);
    this.tempitems[index].sku = this.itemlist[this.index].sku;
  //  this.shippingForm.setControl('items', this.setDesc(this.items));
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

//class Item {
//  sku: string;
//  desc: string;
//  qty: number;
//  fulfillableQty: number;
//}
