import { Injectable } from '@angular/core';

import { Mi } from './prots/mi';

@Injectable()
export class PassMi {
  public mis: any[];
  public _type: string;
  public registerPayment:number;
  public fields: any = {
    "f1": "Cantidad",
    "f2": "Estudio",
    "f3": "Precio"
  }
}
