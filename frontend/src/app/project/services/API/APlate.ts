import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LangService } from '../lang/lang.service';

@Injectable({
    providedIn: 'root'
})

export class APlate {
    conf = require('./conf.json');
    url = this.conf.url;
    
    constructor(private http: HttpClient, private lang:LangService){}

    getAll():Observable<any> {
        let lang = this.lang.getLanguage();
        return this.http.get(`${this.conf.url}/plates?lang=${lang.id}`, this.createHeader());
    }

    getTranslations():Observable<any> {
        return this.http.get(`${this.conf.url}/plates/translations`, this.createHeader());
    }

    updatePlate(plate:any):Observable<any>{
        return this.http.patch(`${this.conf.url}/plates/`, plate, this.multerHeader());
    }

    deletePlate(plate:any):Observable<any>{
        return this.http.delete(`${this.conf.url}/plates?id=${plate}`, this.createHeader());
    }

    newPlate(formData:any):Observable<any>{
        return this.http.post(`${this.conf.url}/plates`, formData, this.multerHeader());
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
    private multerHeader(){
        const header = {
            'Access-Control-Allow-Origin':'*',
            'Acces-Control-Allow-Headers':'Origin, Content-Type, Accept,Authorization'
        }
        return {headers: new HttpHeaders(header)};

    }

}