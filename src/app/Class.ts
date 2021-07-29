import { Time } from '@angular/common';



export class Shipping {
 // type: string;
  id: string;
  orderNo: number;
  customer: string;
  customerNo: string;
  //OrderedAt: Date;
  CreatedAt: Date;
  UpdatedAt: Date;
  CancelledAt: Date;
  ShipBy: Date;
  //PackingSlipId: string;
  //PackingSlipPrint: number;
  ShippingOption: string;
  PackingEndAt: Date;
  ClosedAt: Date;
  ReadyAt: Date;
  IsHold: boolean;
  Packages: Package[] = [];
  shipTo: Address = new Address();
  items: Item[] = [];
  labels: Label[] = [new Label];
  isChargeToCustomer: boolean;
  location: string;
  parentOrderNo: number;
  
}

export class Package {
  BoxNo: number;
  Box: Box;
  PackageItems: ItemQty[] = [];
  Label: Label[] = [];
}

export class ItemQty {
  SpfId: number;
  Qty: number;
  FulfillableQty: number;
  Name: string;

}

export class Box {
  Type: string;
  Name: string;
  Width: number;
  Height: number;
  Length: number;
  Weight: number;
  Customer: string;
  CreatedAt: Time;
  isEditable: boolean;
}

export class Item {
  sku: string;
  qty: number;
  desc: string;
  fulfillableQty: number;
}

export class Address {
  name: string;
  company: string;
  email: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  constructor(country?: string) {
    this.country = country;
  }
}

export class Label {
  CustomerId: string;
  Type: string;
  carrier: string;
  ShippingOption: string;
  IsSignature: boolean;
  IsCertified: boolean;
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

export class Test {
  customer: string;
  orderno: number;
  items: Item[] = [];
  labels: SimpleLabel[] = [new SimpleLabel];
  isChargeToCustomer: boolean;
}

export class SimpleLabel {
  
  IsSignature: boolean;
  IsCertified: boolean;
  Carrier: string;
  ShippingOption: string;

  //constructor() {
  //  this.IsSignature = false;
  //  this.IsCertified = false;
  //}
}
