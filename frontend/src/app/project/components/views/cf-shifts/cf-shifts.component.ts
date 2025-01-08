import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ACalendar } from 'src/app/project/services/API/ACalendar';

@Component({
  selector: 'app-cf-shifts',
  templateUrl: './cf-shifts.component.html',
  styleUrls: ['./cf-shifts.component.css']
})
export class CfShiftsComponent implements OnInit {
  page_status = 'Calendar';
  recurrents:any = [];
  day!:any;
  month:any = {};
  dayNames:any = ["Dl", "Di", "Dm", "Dj", "Dv", "Ds", "Dg"];
  date:any = new Date();
  rules:any = [];

  constructor(private ACalendar:ACalendar, public router:Router) { 
    this.getCalendar();
  }

  async getCalendar(){
    let calendar = await this.ACalendar.getCalendar().toPromise();
    this.recurrents = calendar;
    this.getMonth();
  }

  ngOnInit(): void { }

  getMonthName(month:number){
    let months = ["Gener", "Febrer", "Març", "Abril", "Maig", "Juny", "Juliol", "Agost", "Septembre", "Octubre", "Novembre", "Desembre"]
    return months[month]
  }

  getMonth(){
    // Obtener el año y mes actual
    const year = this.date.getFullYear();
    const month = this.date.getMonth(); // Enero es 0, Febrero es 1, etc.
    this.month.name = this.getMonthName(month);
    this.month.year = year;

    this.getDaysInMonth(year, month);
  }

  getDaysInMonth(year:number, month:number) {
    const date = new Date(year, month, 1);  // Empieza en el primer día del mes
    let dayOfWeek = date.getDay() // 0 == Sunday
    let emptyDays = 0;
    if(dayOfWeek == 0) emptyDays = 6;
    else emptyDays = dayOfWeek-1;

    this.month.days = [];
    // add empty days
    for(let i =0; i < emptyDays; i++){
      this.month.days.push({holiday:false, number:''});
    }

    while (date.getMonth() === month) {
      let day =  new Date(date);
      let number = day.getDate();
      let month = day.getMonth();
      let holiday = false;
      let torns = [];
      
      // get day schedule 
      let recurrent_rule = this.recurrents.filter((r:any) => r.dia == number && r.mes == month)[0];
      if(recurrent_rule){
        let no_recurrent_rule = this.recurrents.filter((r:any) => r.dia == number && r.mes == month && r.any == day.getFullYear())[0]
        if(no_recurrent_rule){ // No recurrent
          holiday = no_recurrent_rule.laboral==0 ? true:false;
          torns = no_recurrent_rule.torns;
        }
        else { // recurrent day
          holiday = recurrent_rule.laboral==0 ? true:false;
          torns = recurrent_rule.torns;
        }
      } else {
        recurrent_rule = this.recurrents.filter((r:any) => r.dia_setmana == day.getDay())[0]
        if(recurrent_rule){ // recurrent week
          holiday = recurrent_rule.laboral==0 ? true:false;
          torns = recurrent_rule.torns;
        } else { // laborable
          recurrent_rule = this.recurrents.filter((r:any) => r.dia_setmana == null && r.dia == null)[0];
          torns = recurrent_rule.torns;
        }
      }
      this.month.days.push({number, holiday, torns});
      date.setDate(date.getDate() + 1);
    }
  }
  changeMonth(num:number){
    this.date.setMonth(this.date.getMonth()+num);
    this.getMonth();
  }

  selectDay(shift:HTMLElement){
    // get datetime number to be able to remove last update
    let now = new Date();
    let timestamp = now.getTime();

    if(shift.classList.contains('start')) shift.classList.remove('start')
    else {
      let startTime = document.querySelector(".shift.start:not(.colored)");

      if(startTime){
        let allShifts = document.querySelectorAll(".shift");
        let shiftArray = Array.from(allShifts);
        let start = shiftArray.indexOf(startTime);
        let end = shiftArray.indexOf(shift);
        for(let i=start; i<end+1;i++){
          shiftArray[i].classList.add('colored');
          shiftArray[i].setAttribute('number', timestamp.toString());
        }
        shift.classList.add('end');
      }

      else {
        shift.classList.add('start');
        shift.setAttribute('number', timestamp.toString());
      }
    }
  }

  removeShiftTimes(allShifts:any){
    if(!allShifts) allShifts = document.querySelectorAll(".shift.colored, .shift.start");
    allShifts.forEach((s:any) => {
      s.classList.remove('colored', 'start', 'end')
      s.removeAttribute('number')
    })
  }

  shiftRollback(){
    let allShifts = document.querySelectorAll(".shift.colored, .shift.start");
    let number = 0;
    allShifts.forEach((s:any) => {
      let attr = parseInt(s.getAttribute('number'));
      if(attr>number) number = attr;
    });
    let deleteObjs = document.querySelectorAll(`.shift[number='${number.toString()}']`);
    this.removeShiftTimes(deleteObjs);
  }

  async editDay(day:any){
    let weekDays = ["Diumenge",'Dilluns', 'Dimarts', "Dimecres", "Dijous", "Divendres", "Dissabte"]
    let year = this.date.getFullYear();
    let month = this.date.getMonth();
    this.day = this.month.days.filter((m:any) => m.number == day.number)[0];
    this.day.year = year;
    this.day.month = month;
    let datetmp = new Date(year, month, day.number)
    this.day.week = weekDays[datetmp.getDay()];

    // get rules
    let rules = this.getRules({year, month, day:day.number, weekDay:datetmp.getDay()})
    this.rules = rules
    //let rules = await this.ACalendar.getRules({year, month, day:month.number, weekDay:this.day.week})

    this.page_status = 'Edit';
    setTimeout(() => {
      let days = document.querySelectorAll(".shift");
      if(days.length > 0){
        if(!this.day.holiday){
          this.day.torns.forEach((t:any) => {
            days.forEach((d:any) => {
              let day = parseInt(d.textContent.replace(':00', ''));
              let inici = parseInt(t.inici.replace(':00', ''));
              let fi = parseInt(t.fi.replace(':00', ''));
              if(day >= inici && day <= fi) d.classList.add('colored');
              if(day==inici) d.classList.add('start');
              if(day==fi) d.classList.add('end');
            });
          });
        }
      }
    },50);
  }

  getRules(day:any){
    let rules:any = []
    this.addRules(rules, this.recurrents.filter((r:any) => r.dia == day.day && r.mes == day.month && r.any == day.year), 1)
    this.addRules(rules, this.recurrents.filter((r:any) => r.dia == day.day && r.mes == day.month && r.any == null), 2)
    this.addRules(rules, this.recurrents.filter((r:any) => r.dia_setmana == day.weekDay), 3)
    return rules
  }
  addRules(rules:any, rulesFiltered:any, type:number){
    if(rulesFiltered.length>0){
      let message = '';
      rulesFiltered.forEach((r:any) => {
        switch(type){
          case 1:
            if(rules.laboral == 1) message = `Laboral amb data ${r.dia}/${r.mes}/${r.any}`
            else message = `Festiu amb data ${r.dia}/${r.mes}/${r.any}`
            break;
          case 2:
            if(rules.laboral == 1) message = `Laboral tots els ${r.dia}/${r.mes} de cada any`
            else message = `Festiu tots els ${r.dia}/${r.mes} de cada any`
            break;
          case 3:
            let weekDays = ["Diumenge",'Dilluns', 'Dimarts', "Dimecres", "Dijous", "Divendres", "Dissabte"]
            if(rules.laboral == 1) message = `Laborals tots els ${weekDays[r.dia_setmana]}`
            else message = `Festius tots els ${weekDays[r.dia_setmana]}`
            break;
        }
        rules.push(message)
      })
    }
  }

  check(option:HTMLElement){
    if(option.classList.contains('checked')) option.classList.remove('checked');
    else option.classList.add('checked');
  }

  async updateDaySchedule(btn:HTMLElement){
    btn.classList.add('loading')
    let eventType = document.querySelector("nav .active");

    if(eventType?.classList.contains("regles")){ // DELETE
      console.log('delete')
    } else {
      let newRule:any = {
        dia:null,
        mes:null,
        any:null,
        laboral:0,
        dia_setmana:null,
        torns:[]
      }
      let type:string = '';
      let checkbox = document.querySelector("input[name='herency']:checked")?.getAttribute('recurrent-type');
      if(!checkbox && eventType?.classList.contains("festiu")){
        let error = document.querySelector('.error');
        if(error){
          error.classList.remove('hide')
          setTimeout(() => {
            if(error) error.classList.add('hide')
          }, 4990);
        }
      } else {
        switch(checkbox){
          case ('date'): // no recurrent
            newRule.dia = this.day.number;
            newRule.mes = this.day.month;
            newRule.any = this.day.year;
            type = 'date';
            break;
          case ('year'): // recurrent date
            newRule.dia = this.day.number;
            newRule.mes = this.day.month;
            type = 'year';
            break;
          case('week'): // recurrent week
            let date = new Date(this.day.year, this.day.month, this.day.number)
            newRule.dia_setmana = date.getDay();
            type = 'week';
            break;
          default: // all laborables
            newRule.laboral = 1;
            type = 'all';
            break;
        }
        if(eventType?.classList.contains("horari")){ // LABORABLE
          newRule.laboral = 1;
          let start_shifts:any = [];
          document.querySelectorAll('.shift.start')?.forEach((a:any) => {
            start_shifts.push(a.textContent.replace(/\s+/g, ''));
          });
          let end_shifts:any = [];
          document.querySelectorAll('.shift.end')?.forEach((a:any) => {
            end_shifts.push(a.textContent.replace(/\s+/g, ''))
          });
          newRule.torns.push(start_shifts)
          newRule.torns.push(end_shifts)
        }
        try{
          await this.ACalendar.newSchedule({newRule, type}).toPromise()
        } catch(e){}
      }
    }
    
    await this.getCalendar();
    btn.classList.remove('loading');
    this.page_status='Calendar';
  }
}