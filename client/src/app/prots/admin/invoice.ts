import { Client } from '../client';
export class Invoice {
  _id: string;
  is_invoiced: boolean;
  timestamp: Date;
  type: string;
  sale: string;
  saleObject: Object;
  client: string;
  clientObject: Client;
  total: Number;
}
