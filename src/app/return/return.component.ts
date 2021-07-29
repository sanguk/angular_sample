import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Shipping, Item } from '../Class';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { ReturnService } from '../_services/return.service';
import { ItemService } from '../_services/item.service';

declare function print_zpl(zpl: string): void;

@Component({
  selector: 'app-return',
  templateUrl: './return.component.html',
  styleUrls: ['./return.component.scss']
})

export class ReturnComponent {
  shipping: any;
  receiving: any;
  RMANo: string;
  retruncodes: string[] = ["A - Item Damaged",
    "B - Wrong Item Shipped", "C - Not as Described",
    "D - Not as Expected", "E - Do not Want",
    "INSUFFICIENT ADDRESS", "ATTEMPTED - NOT KNOWN", "REFUSED", "UNCLAIMED", "OTHER"];
  returncodeinputs: string[];
  returncode: string;
  iteminputs: RMAList[] = [];
  customers: string[] = ["Krave", "ToyoLife", "AWI", "Spigen", "HoneyJarret", "Arencia", "CrossPoint", "Beauteers", "Beauteers1", "Jayjun", "PeopleLook", "Xuyoni", "ECOEXLAB", "GAMAGE", "AIONCO", "Looksnmeii", "GAMAGE", "Beauteers1"];
  itemList: any[] = [];
  barcodeValue: string;
  locations: string[] = ["AWISEC", "AWICAS"];
  customer: string;
  location: string;

  @ViewChild('input1') inputEl1: ElementRef;
  @ViewChild('input2') inputEl2: ElementRef;
  @ViewChild('input3') inputEl3: ElementRef;

  constructor(private fb: FormBuilder, private http: HttpClient,
    private returnService: ReturnService, private itemService: ItemService) { }

  ngOnInit() {
    setTimeout(() => this.inputEl3.nativeElement.focus());
  }

  onSubmit() {
    if (this.customer == null || this.location == null) {
      alert('please select customer and/or location.');
      return;
    }

    this.returnService.getReturnReceivingwithloc(this.customer, this.location)
    .subscribe(response => {
      if (response["isSuccess"]) {
        console.log(response["data"]);
        this.receiving = response["data"];
        setTimeout(() => this.inputEl2.nativeElement.focus());
      }
    });

    this.itemService.getItemList(this.customer).subscribe(data => {
      this.itemList = data;
      console.log(this.itemList);
    });
      
  }

  onExit() {
    this.shipping = null;
    this.receiving = null;
    this.iteminputs = [];
    setTimeout(() => this.inputEl3.nativeElement.focus());
  }


  onBarcodeChange(event: string): void {
    console.log(event);
    this.RMANo = event;

    //not support for CrossPoint, Arencia, Lynden, and PeopleLook
    if ((this.RMANo.substring(0, 2).toUpperCase()) == "KB") { //Krave

      this.returnService.getReturnReceivingwithrma("Krave", this.RMANo).subscribe(response => {
        if (response["isSuccess"]) {
          this.shipping = response["data"];
          console.log('before printing shipping');
          console.log(this.shipping);
          setTimeout(() => this.inputEl1.nativeElement.focus());
        }
      });

      this.itemService.getItemList("Krave").subscribe(data => {
        this.itemList = data;
        console.log(data);
      });
    }

    if ((this.RMANo.substring(0, 2).toUpperCase()) == "JJ") { //Jayjun
      this.returnService.getReturnReceivingwithrma("Jayjun", this.RMANo).subscribe(response => {
        if (response["isSuccess"]) {
          console.log(response["data"]);
          this.shipping = response["data"];
          setTimeout(() => this.inputEl1.nativeElement.focus());
        }
      });

      this.itemService.getItemList("Jayjun").subscribe(data => {
        this.itemList = data;
        console.log(data);
      });

    }
    if ((this.RMANo.substring(0, 2).toUpperCase()) == "HJ") { //HoneyJarret
      this.returnService.getReturnReceivingwithrma("HoneyJarret", this.RMANo).subscribe(response => {
        if (response["isSuccess"]) {
          console.log(response["data"]);
          this.shipping = response["data"];
          setTimeout(() => this.inputEl1.nativeElement.focus());
        }
      });

      this.itemService.getItemList("HoneyJarret").subscribe(data => {
        this.itemList = data;
        console.log(data);
      });

    }
    if ((this.RMANo.substring(0, 2).toUpperCase()) == "BT") { //Beauteers
      this.returnService.getReturnReceivingwithrma("Beauteers",  this.RMANo).subscribe(response => {
        if (response["isSuccess"]) {
          console.log(response["data"]);
          this.shipping = response["data"];
          setTimeout(() => this.inputEl1.nativeElement.focus());
        }
      });

      this.itemService.getItemList("Beauteers").subscribe(data => {
        this.itemList = data;
        console.log(data);
      });

      }
      if ((this.RMANo.substring(0, 2).toUpperCase()) == "B1") { //Beauteers1
        this.returnService.getReturnReceivingwithrma("Beauteers1",  this.RMANo).subscribe(response => {
          if (response["isSuccess"]) {
            console.log(response["data"]);
            this.shipping = response["data"];
            setTimeout(() => this.inputEl1.nativeElement.focus());
          }
        });

        this.itemService.getItemList("Beauteers1").subscribe(data => {
          this.itemList = data;
          console.log(data);
        });

      }
    if ((this.RMANo.substring(0, 2).toUpperCase()) == "SW") { //SGLife
      this.returnService.getReturnReceivingwithrma("SGLife", this.RMANo).subscribe(response => {
        if (response["isSuccess"]) {
          console.log(response["data"]);
          this.shipping = response["data"];
          setTimeout(() => this.inputEl1.nativeElement.focus());
        }
      });

      this.itemService.getItemList("SGLife").subscribe(data => {
        this.itemList = data;
        console.log(data);
      });
    }
    if ((this.RMANo.substring(0, 2).toUpperCase()) == "SP") { //Spigen
      this.returnService.getReturnReceivingwithrma("Spigen",  this.RMANo).subscribe(response => {
        if (response["isSuccess"]) {
          console.log(response["data"]);
          this.shipping = response["data"];
          setTimeout(() => this.inputEl1.nativeElement.focus());
        }
      });

      this.itemService.getItemList("Spigen").subscribe(data => {
        this.itemList = data;
        console.log(data);
      });
    }
    if ((this.RMANo.substring(0, 2).toUpperCase()) == "TY") { //ToyoLife
      this.returnService.getReturnReceivingwithrma("ToyoLife",  this.RMANo).subscribe(response => {
        if (response["isSuccess"]) {
          console.log(response["data"]);
          this.shipping = response["data"];
          setTimeout(() => this.inputEl1.nativeElement.focus());
        }
      });

      this.itemService.getItemList("ToyoLife").subscribe(data => {
        this.itemList = data;
        console.log(data);
      });
    }
    
  }


  onSkuChangewithNothing(barcode: string) {
    console.log(barcode);

    for (let i = 0; i < this.itemList.length; i++) {
      if (this.itemList[i].sku == barcode || this.itemList[i].upc == barcode) {
        let temp: RMAList = {
          receiptqty: 1,
          sku: this.itemList[i].sku,
          upc: this.itemList[i].upc,
          desc: this.itemList[i].desc,
          customer: this.itemList[i].customer,
          grade: '',
          note:''
        };

        this.iteminputs.push(temp);
      }
    }
    console.log(this.iteminputs);
    this.barcodeValue = "";
  }

  deleteRow(index: number) {
  //  var index = this.iteminputs.map(function (e) { return e.sku }).indexOf(sku);
    this.iteminputs.splice(index, 1);
  //  console.log(this.iteminputs);
  }


  onCompletedwithRMA() {
    this.shipping.items = this.iteminputs;
    this.returnService.postReturnReceiving(this.shipping).subscribe(response => {
      if (response["isSuccess"]) {
        console.log(response["data"]);
        alert('returned successfully.');
        this.onExit();
      } else {
        alert(response["errorMsg"]);
      }
    });
  }

  onCompletedwithReceiving() {
    this.receiving.items = this.iteminputs;
    this.returnService.postReturnReceiving(this.receiving).subscribe(response => {
      if (response["isSuccess"]) {
        console.log(response["data"]);
        alert('returned successfully.');

        this.returnService.getReturnReceivingwithloc(this.customer, this.location).subscribe(response => {
          if (response["isSuccess"]) {
            console.log(response["data"]);
            this.receiving = response["data"];
            setTimeout(() => this.inputEl2.nativeElement.focus());
          }
        });
        this.iteminputs = [];

      } else {
        alert(response["errorMsg"]);
      }
    });
    
  }

  


}


class ItemList {
  id: string;
  sku: string;
  qty: number;
  upc: string;
  upc2: string;
  desc: string;
  weight: number;
  customer: string;
  isEditable: boolean = false;
//  receiptqty: number;
//  grade: string;
}

class RMAList {
  //  id: string;
  receiptqty: number;
  sku: string;
  //  qty: number;
  upc: string;
  //  upc2: string;
  desc: string;
  //  weight: number;
  customer: string;
  //  isEditable: boolean = false;
  grade: string;
  note: string;
}
