import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class UsrService {
  private uri = 'http://localhost:3000/usrs';
  private usrUri = 'http://localhost:3000/login';

  constructor(
    private http: Http
  ) {

  }

  private handleError(error: any): Promise<any> {
    console.log(error);
    return Promise.reject(error.message || error);
  }

  getUsr(key): any {
    return this.http.get(this.uri + "/" + key)
      .toPromise()
      .then(r => {
        var d = r.json().data[0];
        sessionStorage.setItem("usr", d["usr"])
        sessionStorage.setItem("role", d["role"])
        sessionStorage.setItem("id", d["id"])

        console.log(d)

        return d;
      })
      .catch(this.handleError);
  }

  dropInfo(): any {
    sessionStorage.setItem("usr", null)
    sessionStorage.setItem("role", null)
    sessionStorage.setItem("id", null)
  }

  init(usr: string, pass: string): any {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    var data = {
      usr: usr,
      pass: pass
    }

    return new Promise((resolve, reject) => {
      return this.http.post(this.usrUri, data, { headers: headers })
        .toPromise()
        .then(r => {
          r = r.json().ok;

          if (r) {
            console.log(usr)
            this.getUsr(usr)
              .then(u => resolve(u))
          } else
            resolve({ role: null });

        })
        .catch(this.handleError);
    });

  }

  get(): any {
    return {
      usr: sessionStorage.getItem("usr"),
      role: sessionStorage.getItem("role"),
      id: sessionStorage.getItem("id")
    }
  }
}
