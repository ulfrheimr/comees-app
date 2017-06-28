import { Pres } from './pres';
import { Lab } from './lab';

export class Drug {
  _id: string;
  code: string;
  name: string;
  substance: string;
  dosage: string;
  ssa: string;
  desc: string;
  max_price: number;
  sale_price: number;
  qty: number;
  lab: Lab;
  presentation: Pres;
}
