import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfOrdersAllComponent } from './cf-orders-all.component';

describe('CfOrdersAllComponent', () => {
  let component: CfOrdersAllComponent;
  let fixture: ComponentFixture<CfOrdersAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfOrdersAllComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CfOrdersAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
