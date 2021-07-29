import { Component } from '@angular/core';
import { HttpClientModule, HttpClient, HttpHeaders } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { Shipping, Package, ItemQty, Box, Address, SimpleLabel } from '../Class';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LabelService } from '../_services/label.service';
import { Time } from '@angular/common';


declare function print_zpl(zpl: string): void;

@Component({
    selector: 'app-shipment-creation-component',
  templateUrl: './shipment-creation.component.html',
    styleUrls: ['./shipment-creation.component.scss']
})

export class ShipmentCreationComponent {

    billingaccounts: string[] = ["AWI", "AIF"]
    mailproviders: string[] = [ "FedEx", "Endicia"]
    endishippingopt: string[] = ["First", "Priority"]
    fedshippingopt: string[] = ["FEDEX_2_DAY", "FEDEX_GROUND", "SMART_POST","FEDEX_MPS"]

    locations: string[] = ["AWISEC", "AWICAS"]
    location: string;
    customers: string[] = ["Krave", "Jayjun", "Beauteers", "Beauteers1", "HoneyJarret", "AIF"]

    shipFrom: Address = new Address("US");
    shipTo: Address = new Address("US");
    itemlist: ItemList[];
    //MaxOrderNo: number;
    index: number;
    carrier: string;
    labelForm;
    labelResult: LabelTicket;

    seclocation: boolean = false;
    caslocation: boolean = false;


  constructor(private http: HttpClient, private router: Router,
    private labelService: LabelService) {
        this.labelForm = new LabelForm();
        this.labelForm.labelpackages = [new LabelPackage];
    }


    addarow(): void {
      console.log('addlabelpackage start');
      this.labelForm.labelpackages.push(new LabelPackage());
      console.log(this.labelForm.labelpackages);
    }


    deletelabelpackage(index) {
        this.labelForm.labelpackages.splice(index, 1);
        console.log(this.labelForm.labelpackages);
    }

    changelocation1(): void {
        this.caslocation = false;
        this.seclocation = !this.seclocation;

        if (this.seclocation == true) {
            const awisec = new Address();
            awisec.name = "Advanced Warehouse";
            awisec.address1 = "20 Enterprise Ave N Secaucus";
            awisec.city = "Secaucus";
            awisec.state = "NJ";
            awisec.zip = "07094";
            awisec.country = "US";
            awisec.phone = "5512577070";
            this.shipFrom = awisec;
        }

        console.log("secacus: " + this.seclocation);
        console.log("carson: " + this.caslocation);
        this.labelForm.shipFrom = this.shipFrom;
        console.log(this.labelForm);
    }

    changelocation2(): void {
        this.seclocation = false;
        this.caslocation = !this.caslocation;

        if (this.caslocation == true) {
            const awicas = new Address();
            awicas.name = "West Warehouse 123";
            awicas.address1 = "Address1";
            awicas.city = "Compton";
            awicas.state = "CA";
            awicas.zip = "90211";
            awicas.country = "US";
            awicas.phone = "1231231234";
            this.shipFrom = awicas;
        }

        console.log("secacus: " + this.seclocation);
        console.log("carson: " + this.caslocation);
        this.labelForm.shipFrom = this.shipFrom;
        console.log(this.labelForm);
    }

    changelocation3(): void {
        this.seclocation = false;
        this.caslocation = false;
        this.shipFrom = new Address("US");
      
        console.log("secacus: " + this.seclocation);
        console.log("carson: " + this.caslocation);
        console.log(this.shipFrom);
    }

    passmodel(): void {
      if (this.labelForm.reference == null || this.labelForm.reference == "") {
        alert('no reference # !');
        return;
      }
      if (this.labelForm.customer == null || this.labelForm.customer == "") {
        alert('no customer info.');
        return;
      }

      this.labelForm.shipTo = this.shipTo;
        console.log(this.labelForm);

        this.labelService.getLabel(this.labelForm).subscribe(data => {
          console.log(data);
          this.labelResult = data as LabelTicket;
          console.log(this.labelResult);

          if (this.labelResult.labelResponse.isSuccess == true) {
            for (let i = 0; i < this.labelResult.labelResponse.labels.length; i++) {
             // console.log(this.labelResult.labelResponse.labels[i].image); 
              print_zpl(this.labelResult.labelResponse.labels[i].image);
            //  this.printzpl(this.labelResult.labelResponse.labels[i].Image);
              alert('successfully created.');
            }
          } else {
            console.log(this.labelResult.labelResponse.errorCode);
            alert(this.labelResult.labelResponse.errorCode);
          }

        });
    }

    log(): void {
        console.log(this.shipFrom);
        console.log(this.shipTo);
    }


    printzpl(): void {
     // console.log(image);
    //  print_zpl(image);
    //print_zpl('^XA^BY3,2,130^FO5,50^BC^FDKB12345601^FS^XZ');

      console.log('end');
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

class LabelForm {

    billingaccount: string;
    customer: string;
    reference: string;

    shipFrom: Address;
    shipTo: Address;

    shippingoption: string;
    labelpackages: LabelPackage[];
    isCertified: boolean;
    isSignature: boolean;
    insuredValue: number;
  constructor() {
    this.isCertified = false;
    this.isSignature = false;
  }

}

class LabelPackage {
    weight: number;
    lenght: number;
    width: number;
    height: number;
    qty: number;
}

class LabelTicket {
  labelRequest: LabelRequest;
  labelResponse: LabelResponse;
}

class LabelRequest {
  carrier: string;
  shippingOption: string;
  fedExAccountNumber: string;
  fedExMeterNumber: string;
  fedExUserCredentialKey: string; //"xNZYa4rMiZQ7xrtz"
  fedExUserCredentialPassword: string; //"SMuLBaOhL1QPf7yqsChBFrrnl"
  fedexHubId: string; //"5087"
  endiciaRequesterID: boolean; //null
  endiciaAccountID: boolean; //null
  endiciaPassPhrase: boolean; //null
  endiciaOrderAccount: boolean; //null
  upsUserName: boolean; //null
  upsPassWord: boolean; //null
  upsAccessKey: boolean; //null
  upsAccountNo: boolean; //null
  shipFrom: Address; //{ name: "Advanced Warehouse", company: null, address1: "20 Enterprise Ave N Secaucus", address2: null, city: "Secaucus", … }
  shipTo: Address  //{ name: "Haneul Test", company: null, address1: "1233 test", address2: "1234", city: "Jersey city", … }
  packages: LabelPackage[];
  referenceID: string; //null
  desc: string; //null
  isReturnLabelRequested: boolean; //false
  isSignature: boolean; //false
  isCertified: boolean; //false  
}

class LabelResponse {
  isSuccess: boolean; //true
  warningCode: string; //""
  errorCode: string; //""
  labels: Label[]; //[{ … }]
  transactionID: string; //"37p338fj44e7e054d058200"
}

class Label {
  customerId: string;
  type: string;
  carrier: string;
  shippingOption: string;
  isSignature: boolean;
  isCertified: boolean;
  createdAt: Time;
  transactionID: string;
  trackingNo: string;
  price: number;
  adjustPrice: number;
  refundPrice: number;
  image: string;
  estimateAt: Time;
  shipOutAt: Time;
  //DeliveryAt: Time;
}
