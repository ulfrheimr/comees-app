export class Coupon {
  _id: string;
  code: string;
  discount: number;
  init_date: Date;
  end_date: Date;
  apliable_category: Object;
  description: string;
}
