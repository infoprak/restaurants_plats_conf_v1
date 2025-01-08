import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AOrder } from 'src/app/project/services/API/AOrder';

@Component({
  selector: 'app-cf-kitchen',
  templateUrl: './cf-kitchen.component.html',
  styleUrls: ['./cf-kitchen.component.css']
})
export class CfKitchenComponent implements OnInit {
  states = ['Espera','Preparació','Fet'];
  line:any;
  orders:any = []
  constructor(private AOrder:AOrder, public router:Router) { }

  ngOnInit(): void {
    this.getOrders();
    setInterval(() => this.getOrders(), 10000); // misileconds
  }

  async getOrders() {
    let orders = await this.AOrder.getAll().toPromise();
    this.orders = orders.filter((o:any) => o.state < 2);

    // order by time
    this.orders.sort((a:any, b:any) => {
      let btime = b.time.split(':');
      btime = parseInt(`${btime[0]}${btime[1]}`)
      let atime = a.time.split(':');
      atime = parseInt(`${atime[0]}${atime[1]}`)
      return atime - btime;
    });
  }

  getNextState(state:string) {
    let index = this.states.indexOf(state);
    return this.states[index+1];
  }

  async nextState(plate:any, order:any) {
    let index = this.states.indexOf(plate.state);
    plate.state = this.states[index+1];
    let response = await this.AOrder.updatePlate(plate, order.id).toPromise();
    if(response.data == "OK"){
      let pendents = order.plates.filter((o:any) => o.state != 'Fet')
  
      if(pendents.length==0) {
        order.state = 1;
        let response = await this.AOrder.update(order).toPromise();
      }
    }
  }

  async archiveOrder(order:any){
    order.state = 2;
    let response = await this.AOrder.update(order).toPromise();
    let index = this.orders.indexOf(order);
    this.orders.splice(index, 1);
  }
}