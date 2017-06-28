import { Drug } from './drug';

export class PhProduct {
  _id: string;
  type_discount: number;
  sale_price:number;
  pricme_with_discount:number;
  drug: Drug;
  qty: number;
}
