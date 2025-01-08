import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LangService {
  json!:any;
  private langSubject = new BehaviorSubject<any>(null);
  langObservable = this.langSubject.asObservable();
  language:any = {id:1,abr:'cat'};
  defaultLang:any = {id:1,abr:'cat'};

  constructor() {}

  getLanguage(){ return this.language; }

  setLanguage(language:any){
    /*try{
      this.json = require(`../../../../assets/lang/${language.abr}.json`);
    } catch(e){require(`../../../../assets/lang/${this.defaultLang.abr}.json`);} */
    language.abr.toLocaleUpperCase();
    this.language = language;
    this.langSubject.next(this.json);
  }

  isDefined(){
    if(this.json) return true;
    else return false
  }

  getSection(section:string) {
    if(!this.json) this.setLanguage(this.defaultLang)
    return this.json[section];
  }
}