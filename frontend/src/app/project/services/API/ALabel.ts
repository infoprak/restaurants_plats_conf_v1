import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LangService } from '../lang/lang.service';

@Injectable({
    providedIn: 'root'
})


export class ALabel {
    conf = require('./conf.json');
    url = this.conf.url;
    
    constructor(private http: HttpClient, private lang:LangService){}

    getAll():Observable<any> {
        let lang:any = this.lang.getLanguage();
        return this.http.get(`${this.conf.url}/labels?lang=${lang.id}`, this.createHeader());
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