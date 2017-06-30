import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class UsrService {
  private uri = 'http://localhost:3000/usrs';

  constructor(
    private http: Http
  ) {

  }

  private handleError(error: any): Promise<any> {
    console.log(error);
    return Promise.reject(error.message || error);
  }

  init(key): any {
    return this.http.get(this.uri + "/" + key)
      .toPromise()
      .then(r => {
        return r.json().data[0];
      })
      .catch(this.handleError);

    // localStorage.setItem("current", JSON.stringify({ token: token, name: name }));
  }

  get(): any {

  }
}
