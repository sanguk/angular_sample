import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { User } from '@app/_models';
import { ShippingService } from '../_services/shipping.service';
import { Time } from '@angular/common';
import { Shipping, Label } from '../Class';

declare function print_zpl(zpl: string): void;

@Component({
  templateUrl: './orderdetail.component.html',
  styleUrls: ['./orderdetail.component.scss']
})

export class OrderDetailComponent {

  locations: string[] = ["All", "AWISEC", "AWICAS"];
  customers: string[] = ["Krave", "ToyoLife", "AWI", "Spigen", "HoneyJarret", "Arencia", "CrossPoint", "Beauteers", "Jayjun", "PeopleLook", "Xuyoni", "ECOEXLAB", "AIONCO", "Looksnmeii", "GAMAGE", "Beauteers1"];
  mainForm;
  customer: string;
  orderNo: number;
  customerNo: string;
  orderdetail: any;
  label: any;

  isTrackingEditable: boolean = false;
  isAddressEditable: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router,
    private shippingService: ShippingService, private _ActivatedRoute: ActivatedRoute) {

    this.mainForm = fb.group({
      orderNo: [Number],
      customerNo: '',
      customer: "Krave",
      labels: new Label
    });

    this.customer = this.mainForm.controls['customer'];
    this.orderNo = this.mainForm.controls['orderNo'];
    this.customerNo = this.mainForm.controls['customerNo'];
  }

  sub;
  cus;
  no;

  ngOnInit() {
    this.sub = this._ActivatedRoute.paramMap.subscribe(params => {
      this.cus = params.get('cus');
      this.no = params.get('no');

      this.shippingService.getOrderDetail(this.cus, this.no)
        .subscribe(data => {
          console.log(data);
          this.orderdetail = data;
        })
    })
  }

  addressUpdate() {
    this.shippingService.updateAddress(this.orderdetail).subscribe(data => {
      console.log(data);
      alert('successfully updated.');
    })
    this.isAddressEditable = !this.isAddressEditable;
  }

  cancelOrder() {
    if (this.orderdetail.type == 'Spf' || this.orderdetail.type == 'Jet') {
      alert('Cannot cancel: This order type is Spf or Jet.');
    }
    else if (this.orderdetail.labels.length > 0 && this.orderdetail.labels[0].trackingNo != null) {
      alert('Cannot cancel: The label has been created.');
    }
    else if (this.orderdetail.packingEndAt != null) {
      alert('Cannot cancel: The items have been packed.');
    }
    else {
      this.shippingService.cancelOrder(this.orderdetail).subscribe(data => {
        alert('order canceled.');
      });
    }
  }

  closedUpdate(): void {
    if (this.orderdetail.closedAt != null) {
      alert('The order is already closed.')
    } else if (this.orderdetail.orderNo < 10000000) {
      alert('The order type is not "Manual". Only manual orders can be closed manually.')
    } else if (!this.orderdetail.labels || this.orderdetail.labels == null || this.orderdetail.labels[0].trackingNo == null) {
      alert('The order does not have a tracking #.')
    } else if (this.orderdetail.closedAt == null
      && this.orderdetail.orderNo > 10000000
      && (this.orderdetail.type == null || this.orderdetail.type == "Manual")) {
      this.shippingService.closeOrder(this.orderdetail).subscribe(data => {
        console.log(data);
        alert('successfully updated');
      });
    }
  }

  deleteLabel() {
    if (this.orderdetail.type == 'Spf' || this.orderdetail.type == 'Jet') {
      alert('Cannot delete the label: This order type is Spf or Jet.');
    } else if (this.orderdetail.labels == null || !this.orderdetail.labels) {
      alert('Cannot delete the label: This order has no label.');
    } else if (this.orderdetail.labels.length > 0 && this.orderdetail.labels[0].trackingNo == null) {
      alert('Cannot delete the label: This order has no label.');
    } else {
      this.shippingService.deleteLabel(this.orderdetail).subscribe(data => {
        //console.log(data);
        alert('label deleted');
      });
    }
  }

  deleteOrder() {
    this.shippingService.deleteOrder(this.cus, this.no).subscribe(result => {
      if (result["isSuccess"] == true) {
        alert('successfully deleted.');
      } else {
        console.log(result);
        alert(`fail to delete:${result["errorMsg"]}`);
      }
    })
   
  }

  onSubmit(formData) {
    console.log(this.mainForm.get('customerNo').value);
    if (this.mainForm.valid) {
      this.shippingService.postOrderDetail(
        this.mainForm.get('customer').value,
        this.mainForm.get('orderNo').value,
        this.mainForm.get('customerNo').value
      ).subscribe(data => {
        console.log(data);
        this.orderdetail = data;
      })
    }
  }

  reprintLabel() {
    if (this.orderdetail.labels == null || !this.orderdetail.labels) {
      alert('there is no label for this order');
    } else {
      print_zpl(this.orderdetail.labels[0]["image"]);
    }
  }

  trackingUpdate() {
    console.log(this.label);
    if (!this.orderdetail.labels || this.orderdetail.labels == null) {
      this.orderdetail.labels = [];
      this.orderdetail.labels.push(this.label);
    } else {
      this.orderdetail.labels[0].trackingNo = this.label.trackingNo;
      this.orderdetail.labels[0].carrier = this.label.carrier;
    }
    console.log(this.orderdetail.labels);

    this.shippingService.updateTrackingNumber(this.orderdetail).subscribe(data => {
      console.log(data);
      if (data == null) {
        alert('The tracking number duplicates.');
      } else {
        alert('successfully updated');
      }
    });
    this.isTrackingEditable = !this.isTrackingEditable;
  }

  updateAddressForm(): void {
    if (this.orderdetail.labels != null) {
      if (this.orderdetail.labels[0].trackingNo != null) {
        alert('fail to update the address because the label was already created.');
        return;
      }
    }
    if (this.orderdetail.type == "Spf") {
      alert('fail to update the address because this type is Spf.');
      return;
    }
    this.isAddressEditable = !this.isAddressEditable;
  }

  updateTrackingForm() {
    if (this.orderdetail.packingEndAt == null) {
      alert('Packing has not been completed.');
      return;
    }

    if (!this.orderdetail.labels ||
      this.orderdetail.labels == null ||
      this.orderdetail.labels[0].trackingNo == null) {

      this.label = new Label;
      this.isTrackingEditable = !this.isTrackingEditable;
      console.log(this.isTrackingEditable);
      console.log(this.label);

    } else {
      alert('tracking # already exist');
    }
  }

}
