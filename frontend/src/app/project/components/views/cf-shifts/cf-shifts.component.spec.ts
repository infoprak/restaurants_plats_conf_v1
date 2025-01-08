import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfShiftsComponent } from './cf-shifts.component';

describe('CfShiftsComponent', () => {
  let component: CfShiftsComponent;
  let fixture: ComponentFixture<CfShiftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfShiftsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CfShiftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
