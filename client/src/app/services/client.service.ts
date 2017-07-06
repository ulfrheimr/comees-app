import { Injectable, OnInit } from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import {Observable} from 'rxjs';

import 'rxjs/add/operator/mergeMap';

import { Client } from '../prots/client';


@Injectable()
export class ClientService implements OnInit {
  private uri = 'http://localhost:3000/clients';

  constructor(
    private http: Http
  ) {

  }

  ngOnInit(): void {

  }

  private handleError(error: any): Promise<any> {
    console.log(error);
    return Promise.reject(error.message || error);
  }

  getClients(by: string, name: string): Promise<Client[]> {
    return this.http.get(this.uri + "?id=" + name + "&by=" + by)
      .toPromise()
      .then(c => c.json().data)
      .catch(this.handleError)
  }

  putClient(client: Client): Promise<Client> {
    var headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.put(this.uri, client, { headers: headers })
      .toPromise()
      .then(r => r.json().data as Client)
      .catch(this.handleError);
  }
}
