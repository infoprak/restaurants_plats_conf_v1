import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AOrder } from 'src/app/project/services/API/AOrder';

@Component({
  selector: 'app-cf-orders-all',
  templateUrl: './cf-orders-all.component.html',
  styleUrls: ['./cf-orders-all.component.css']
})
export class CfOrdersAllComponent implements OnInit {
  dates:any = []
  orders_all:any = []
  orders:any = [];

  constructor(private AOrder:AOrder, public router:Router) { 
    this.getOrders();
  }

  ngOnInit(): void {
  }

  async getOrders() {
    let orders = await this.AOrder.getAll().toPromise(); // get orders
    this.orders_all = orders;
    // get distinct dates
    let dates = [...new Set(this.orders_all.map((p:any) => p.day))];
    dates.forEach((day:any) => {
      this.dates.push(day);
    });
    // filter orders for a day
    this.filterDates(this.dates[0]);
  }

  filterDates(date:string){
    this.orders = this.orders_all.filter((a:any) => a.day == date)
  }

  showLineDetails(ul:HTMLElement, li:HTMLElement){
    if(li.classList.contains('active')){
      li.classList.remove('active')
    } else {
      ul.querySelector('.active')?.classList.remove('active');
      li.classList.add('active');
    }
  }

}
