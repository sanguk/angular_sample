import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { first, debounceTime } from 'rxjs/operators';
import { User } from '@app/_models';
import { Time } from '@angular/common';
import { TaskService } from '../_services/task.service';
import { PackingService } from '../_services/packing.service';
import { BoxService } from '../_services/box.service';
import { ItemService } from '../_services/item.service';

declare function print_zpl(zpl: string): void;
declare function print_zpl_usb(zpl: string): void;

@Component({
  templateUrl: './packing.component.html'
})

export class PackingComponent {
  elements: any = [];
  total: number;
  filters: Filter[] = [];
  checkedlist: string[] = [];

  constructor(private http: HttpClient, private router: Router,
    private _ActivatedRoute: ActivatedRoute,
    private taskService: TaskService, private packingService: PackingService,
    private boxService: BoxService, private itemService: ItemService) { }

  sub;
  cus;
  no;
  optionsSelect: object[] = [];
  selectedValue: object;
  shipping: any;
  barcodeValue: string;
  itemList: object[] = [];
  packageWeight: any;
  isLockLabel: boolean;

  @ViewChild('input2') inputEl2: ElementRef;

  ngOnInit() {
    this.sub = this._ActivatedRoute.paramMap.subscribe(params => {
      this.cus = params.get('cus');
      this.no = params.get('no');
      this.packingService.getShipping(this.cus, this.no).subscribe(response => {
        if (response["isSuccess"]) {
          console.log(response["data"]);
          this.shipping = response["data"];

          console.log('typeof this.shipping.packages');
          console.log(typeof this.shipping.packages);
          if (this.shipping.packages == null || this.shipping.packages.length == 0) {
            this.newPackage();
          }

          //console.log('onSearchChange nativeElement');
          if (typeof this.shipping.packingEndAt == "undefined" || this.shipping.packingEndAt == null)
            setTimeout(() => this.inputEl2.nativeElement.focus());
        }
      });
    });

    this.boxService.getBoxList(this.cus).subscribe(data => {
      this.optionsSelect = data.map(a => ({
        value: a, label: a["name"]
      }));
      console.log(this.optionsSelect);
    });

    this.itemService.getItemList(this.cus).subscribe(data => {
      this.itemList = data;
    });
  }

  deletePackItem(sku) {
    console.log('deletePackItem: ' + sku);
    console.log(this.shipping.packages.length);
    for (var i = 0; i < this.shipping.packages.length; i++) {
      //console.log(this.shipping.packages[i].length);
      for (var j = 0; j < this.shipping.packages[i].packageItems.length; j++) {
        //console.log(this.shipping.packages[i].packageItems[j].sku);
        if (this.shipping.packages[i].packageItems[j].sku == sku) {
          if (this.shipping.packages[i].packageItems[j].qty > 1) {
            this.shipping.packages[i].packageItems[j].qty -= 1;
          }
          else {
            this.shipping.packages[i].packageItems.splice(j, 1);
          }
          this.getPackageWeight();
          return;
        }
      }
    }
    this.getPackageWeight();
  }

  generateLabel() {
    console.log(this.shipping);

    if (this.isLockLabel) {
      alert('generating label...');
      return;
    }

    this.packingService.generateLabel(this.cus, this.no).subscribe(response => {
      if (response["isSuccess"] == true) {
        //alert('label created');
        //console.log(response);

        console.log(response["data"]);
        console.log(response["labelImage"]);
        console.log(response["rmaImage"]);

        this.shipping.labels = response["data"];
        if (response["rmaImage"] != null) {
          print_zpl(response["rmaImage"]);
        }
        print_zpl_usb(response["labelImage"]); //'print_zpl_usb' is slower then 'print_zpl', so a shipping label is printed using 'print_zpl_usb'
      }
      else {
        alert(response["errorMsg"]);
      }
      this.isLockLabel = false;
    }, error => {
      console.log(error);
      if (error == null) {
        alert('generating label failed(' + error + ')');
      }
      else {
        alert('generating label failed');
      }
      this.isLockLabel = false;
    });
    this.isLockLabel = true;
  }

  getSelectedBox(event: any, i: number) {
    console.log('getSelectedBox: ' + i);
    console.log(event);
    console.log(this.shipping.packages[i].box.name);
    console.log(event.name);

    this.shipping.packages[i].box.name = event.name;
    this.shipping.packages[i].box.height = event.height;
    this.shipping.packages[i].box.weight = event.weight;
    this.shipping.packages[i].box.width = event.width;
    this.shipping.packages[i].box.length = event.length;

    console.log('getSelectedBox event.weight');
    console.log(event.weight);
    this.getPackageWeight();
  }

  getPackageWeight() {
    //packageWeight
    console.log('getPackageWeight start');
    console.log(this.shipping.packages);
    var result = 0;
    for (var i = 0; i < this.shipping.packages.length; i++) {
      //console.log(this.shipping.packages[i].length);
      for (var j = 0; j < this.shipping.packages[i].packageItems.length; j++) {
        //console.log(this.shipping.packages[i].packageItems[j].sku);
        result += this.shipping.packages[i].packageItems[j].qty * this.shipping.packages[i].packageItems[j].weight
      }

      result += this.shipping.packages[i].box.weight * 453.592;
    }

    this.packageWeight = (result / 453.592).toFixed(2);
    console.log(this.packageWeight);
    console.log('getPackageWeight end');
  }

  getPackCount(sku) {
    if (this.shipping == null)
      return 0;

    //console.log('getPackCount');
    if (this.shipping.packages.length == 0) {
      return 0;
    }

    var result = this.shipping.packages//.filter(a => typeof a.sku !== "undefined")
      .reduce((g: number, package1: any) => {
        if (package1.packageItems.some(a => a.sku == sku)) {
          g += package1.packageItems.find(z => z.sku == sku).qty;
        }
        return g;
      }, 0);

    //console.log(result);
    return result;
  }

  newPackage() {
    if (this.shipping.packages == null)
      this.shipping.packages = [];

    this.shipping.packages.push({
      packageItems: [],
      box: {
        boxNo: this.shipping.packages.length + 1,
        width: 0,
        height: 0,
        length: 0,
        weight: 0
      }
    });
  }

  onCompletedPacking() {
    console.log('onCompletedPacking');
    this.shipping.weight = this.packageWeight;
    console.log(this.shipping);

    this.packingService.completePacking(this.cus, JSON.stringify(this.shipping))
      .subscribe(response => {
        console.log(response);
        if (response["isSuccess"] == true) {
          alert('success updated');
          this.shipping.packingEndAt = Date.now();
        }
      });
  }

  onSkuChange(barcode: string) {
    console.log('barcode', barcode);
    //alert(barcode);
    barcode = barcode.trim();

    var i = this.shipping.packages.length - 1;
    var isExist: boolean = false;
    var index = 0;
    for (var j = 0; j < this.shipping.packages[i].packageItems.length; j++) {
      //console.log(this.shipping.packages[i].packageItems[j].sku);
      if (this.shipping.packages[i].packageItems[j].sku == barcode || this.shipping.packages[i].packageItems[j].upc == barcode) {
        isExist = true;
        index = j;
        break;
      }
    }

    if (isExist) {
      this.shipping.packages[i].packageItems[j].qty += 1;
    }
    else {
      if (this.itemList.some(a => a["sku"] == barcode)) {
        var dbItem = this.itemList.find(a => a["sku"] == barcode);

        this.shipping.packages[i].packageItems.push({
          qty: 1,
          name: dbItem["desc"],
          upc: dbItem["upc"],
          sku: barcode,
          weightUnit: dbItem["weightUnit"],
          weight: dbItem["weight"]
        });
        console.log(this.shipping.packages[i]);
      }
      else if (this.itemList.some(a => a["upc"] == barcode)) {
        var dbItem = this.itemList.find(a => a["upc"] == barcode);

        this.shipping.packages[i].packageItems.push({
          qty: 1,
          name: dbItem["desc"],
          sku: dbItem["sku"],
          upc: barcode,
          weightUnit: dbItem["weightUnit"],
          weight: dbItem["weight"]
        });
        console.log(this.shipping.packages[i]);
      }
      else {
        alert('not found item');
      }
    }

    this.barcodeValue = "";
    this.getPackageWeight();
  }

  reprintLabel() {
    print_zpl_usb(this.shipping.labels[0].image);

    if (this.cus == 'Krave') {
      if (this.isLockLabel) {
        alert('generating label...');
        return;
      }

      this.packingService.getRMATicket(this.cus, this.no).subscribe(response => {
        if (response["isSuccess"] == true) {
          //console.log(response["rmaImage"]);
          print_zpl(response["rmaImage"]);
        }
        else {
          alert(response["errorMsg"]);
        }
        this.isLockLabel = false;
        alert('ReturnLabel printed.');
      }, error => {
        console.log(error);
        if (error == null) {
          alert('print RMATicket failed(' + error + ')');
        }
        else {
          alert('print RMATicket failed');
        }
        this.isLockLabel = false;
      });
      this.isLockLabel = true;
    }
  }

  undoCompletedPacking() {
    //console.log(this.shipping);
    //const formData = new FormData();
    //formData.append('shipping', this.shipping);
    //console.log(JSON.stringify(this.shipping));
    this.packingService.unsetPackingSlipEndAt(this.cus, this.no)
      .subscribe(response => {
        if (response["isSuccess"] == true) {
          console.log('unset completed');
          if (typeof this.shipping.packingEndAt === "undefined") {

          }
          else {
            console.log('delete this.shipping.packingEndAt');
            delete this.shipping.packingEndAt;
          }
          //setTimeout(() => this.inputEl2.nativeElement.focus()); // Error 발생하여 확인해야함
          console.log('unset completed2');
        }
      });

  }

}

class Filter {
  sku: string;
  qty: number;
}
