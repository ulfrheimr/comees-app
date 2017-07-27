import { Drug } from './drug';

export class PhProduct {
  _id: string;
  type_discount: number;
  sale_price:number;
  price_with_discount:number;
  drug: Drug;
  qty: number;
}
