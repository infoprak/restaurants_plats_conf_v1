import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})


export class AOrder {
    conf = require('./conf.json');
    url = this.conf.url;
    
    constructor(private http: HttpClient){}
    
    getAll():Observable<any> {
        return this.http.get(`${this.conf.url}/orders`, this.createHeader());
    }

    update(order:any):Observable<any> {
        return this.http.post(`${this.conf.url}/orders/state`, order, this.createHeader());
    }

    updatePlate(plate:any, order_id:number):Observable<any> {
        return this.http.post(`${this.conf.url}/orders/state/plates`, {plate, id:order_id}, this.createHeader());
    }

    private createHeader() {

        const header = {
            'Access-Control-Allow-Origin':'*',
            'Content-Type':'application/json',
            'Accept':'application/json',
            'Acces-Control-Allow-Headers':'Origin, Content-Type, Accept,Authorization'
        }
        return {headers: new HttpHeaders(header)};
    }
}