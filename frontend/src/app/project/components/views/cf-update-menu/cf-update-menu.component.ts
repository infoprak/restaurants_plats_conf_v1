import { Component, OnInit } from '@angular/core';
import { ALabel } from 'src/app/project/services/API/ALabel';
import { APlate } from 'src/app/project/services/API/APlate';
import { LangService } from 'src/app/project/services/lang/lang.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { ALang } from 'src/app/project/services/API/ALang';

@Component({
  selector: 'app-cf-update-menu',
  templateUrl: './cf-update-menu.component.html',
  styleUrls: ['./cf-update-menu.component.css']
})
export class CfUpdateMenuComponent implements OnInit {
  page_state:string = 'Default';
  plate:any;
  plates:any;
  labels:any = [];
  languages:any = ['cat', 'es', 'en'];
  translationsAll:any = [];
  translations:any = [];
  plate_translations:any=[]
  selectedFile:any;
  image:SafeUrl = ''

  constructor(
    private APlate:APlate,
    private lang:LangService,
    private Alabel:ALabel,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef,
    private ALang:ALang,
    public router:Router
  ) { }

  ngOnInit(): void {
    this.getTranslations();
    this.getPlates();
    this.getLabels();
    this.getLanguages();
  }

  async getLanguages(){
    let lang = await this.ALang.getLanguages().toPromise();
    this.languages = lang.lang
  }

  async getTranslations(){
    let translations = await this.APlate.getTranslations().toPromise();
    this.translationsAll = translations.translations;
  }

  async getLabels(){
    let labels = await this.Alabel.getAll().toPromise();
    this.labels = labels;
  }

  async getPlates(){
    let plates = await this.APlate.getAll().toPromise();
    this.plates = plates.plates;
    for (let i = 0; i < this.plates.length; i++){
      let plate = this.plates[i];
      if(plate.image) { // load image
        const bufferData = plate.image.data;
        const uint8Array = new Uint8Array(bufferData);
        const blob = new Blob([uint8Array], { type: 'image/png' });
        const blobReader = new FileReader();
        blobReader.readAsBinaryString(blob);

        blobReader.onloadend = async () => {
          if(blobReader.result) plate.image = this.sanitizer.bypassSecurityTrustUrl((blobReader.result).toString());
          plate.image = plate.image.changingThisBreaksApplicationSecurity
        };
      } else plate.image = "/assets/pitzza.png"
    }

    await this.filterPlates(1);
    this.plate = JSON.parse(JSON.stringify(this.plates[0]))
    this.cdr.detectChanges();
  }

  async filterPlates(lang:string|number){
    if(typeof(lang)=='string') {
      lang = this.languages.filter((l:any) => l.abr == lang)[0].id
    }

    let translations = this.translationsAll.filter((t:any) => t.lang_id == lang)
    this.plates.forEach((p:any) => {
      let translation = translations.filter((t:any) => t.plate_id == p.id)[0]
      p.name_lang = translation.name
      p.description_lang = translation.description
    })
  }

  addLabel(label_name:string){
    let label = this.labels.filter((l:any) => l.name == label_name)[0];
    if(label) this.plate.labels.push(label)
  }

  notUsedLabels(){
    return this.labels.filter((l:any) => !this.plate.labels.includes(l));
  }

  // from plate
  removeLabel(label:any){
    let index = this.plate.labels.indexOf(label)
    if(index!=-1)this.plate.labels.splice(index,1)
  }

  changeImage(input:HTMLInputElement, img:HTMLImageElement, event:any){
    let file = input.files?.[0];
    if (file) {
      img.src = URL.createObjectURL(file);
    }
    this.selectedFile = event.target.files[0];
  }

  async editPlate(plate:any){
    this.page_state='Edit';
    this.plate=JSON.parse(JSON.stringify(plate));
    this.translations = this.translationsAll.filter((t:any) => t.plate_id == plate.id)
    setTimeout(() => {
      this.loadTexts(1);
    }, 50);
  }

  loadTexts(select:HTMLSelectElement|number){
    let default_lang:number;
    if (typeof(select) === "number") default_lang = select;
    else {
      default_lang = this.languages.filter((l:any) => l.abr == select.value)[0].id;
    }

    this.plate_translations = this.translations.filter((t:any) => t.lang_id == default_lang)[0];
    let name:any = document.querySelector(".texts.name input");
    let description:any = document.querySelector(".texts.description textarea");
    if(name && description) {
      name.value = this.plate_translations.name;
      description.value = this.plate_translations.description;
    }
  }

  plateName(type:string){
    let sel_language = document.querySelector(".languages.plate select")
    let text;
    if(sel_language){
      if((sel_language as HTMLSelectElement).value != this.lang.getLanguage()) text = this.plate[`${type}_${(sel_language as HTMLSelectElement).value}`];
      else text = this.plate[type];
    }
    return text
  }

  updateContent(type:string, input:any){
    let index = this.translationsAll.indexOf(this.translations)
    if(index != -1){
      this.translationsAll[index][type] = input.value
      this.translations[type] = input.value;
    }
  }

  async updatePlate(price:string){
    let updated_plate = this.plates.filter((p:any) => p.id = this.plate.id)[0];
    updated_plate = this.plate;
    updated_plate.preu = parseFloat(price);
    const formData = new FormData();
    let blob:Blob = new Blob();

    if (this.selectedFile) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFile);
        reader.onload = async () => {
          if(reader.result){
            blob = new Blob([reader.result], { type: this.selectedFile.type });
            updated_plate.image = reader.result;
            formData.append('file', blob, this.selectedFile.name);
            formData.append('plate', JSON.stringify(this.plate));
            formData.append('plate_lang', JSON.stringify(this.translationsAll));
            await this.APlate.updatePlate(formData).toPromise();
            this.getPlates();
          }
        }
      } catch(e){console.log(e);}
    } else {
      formData.append('plate', JSON.stringify(this.plate));
      formData.append('plate_lang', JSON.stringify(this.translationsAll));
      await this.APlate.updatePlate(formData).toPromise();
    }
    this.page_state = 'Default';
    this.getPlates();
  }

  async removePlate(plate:any){
    try {
      let response = await this.APlate.deletePlate(plate.id).toPromise();
      if(response.data == 'OK'){
        let index = this.plates.indexOf(plate);
        if(index != -1) this.plates.splice(index, 1);
      }
    } catch(e){}
  }

  async createPlate(name:string, description:string, price_str:string){
    if(name && description && price_str){
      let price = parseFloat(price_str);
      const formData = new FormData();
      let blob:Blob = new Blob();
      let plate_id = -1;

      if (this.selectedFile) {
        try {
          const reader = new FileReader();
          reader.readAsDataURL(this.selectedFile);
          reader.onload = async () => {
            if(reader.result){
              blob = new Blob([reader.result], { type: this.selectedFile.type });
              formData.append('file', blob, this.selectedFile.name);
              formData.append('plate', JSON.stringify({name, description, price}));
              let response = await this.APlate.newPlate(formData).toPromise();
              plate_id = response.id;
            }
          }
        } catch(e){console.log(e);}
      } else {
        formData.append('plate', JSON.stringify({name, description, price}));
        let response = await this.APlate.newPlate(formData).toPromise();
        plate_id = response.id;
      }

      this.page_state = 'Edit';
      setTimeout(() => {
        if(plate_id > -1){
          this.plate.id = plate_id;
          this.plate.name = name;
          this.plate.name_lang = name;
          this.plate.description = description;
          this.plate.description_lang = description;
          this.plate.preu = price;
          this.plate_translations.name = name;
          this.plate_translations.description = description;
          let descriptionHTML:any = document.querySelector(".texts.description textarea");
          if(descriptionHTML) descriptionHTML.value = description;
        }
      }, 50);
    }
  }
}