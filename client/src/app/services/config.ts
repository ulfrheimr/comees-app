import { Injectable } from '@angular/core';
import { Http} from '@angular/http';
import { ClientService } from './client.service';
import { AppModule } from '../app.module';

import 'rxjs/add/operator/map'

@Injectable()
export class Config {
  private config: any;
  constructor(
    private http: Http
  ) {

  }

  private handleError(error: any): Promise<any> {
    console.log(error);
    return Promise.reject(error.message || error);
  }

  private load() {
    return new Promise((resolve, reject) => {
      this.http.get('assets/config/env.json')
        .map(r => r.json())
        .subscribe(data => {
          resolve(data);
        });
    });

  }

  get(key: string): any {
    if (this.config == undefined) {
      this.load()
        .then(r => {
          this.config = r['config'];
          return this.config[key];
        })
        .catch(this.handleError);
    }
    else {
      return this.config[key];
    }
  }
}
