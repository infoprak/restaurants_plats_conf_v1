import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfKitchenComponent } from './cf-kitchen.component';

describe('CfKitchenComponent', () => {
  let component: CfKitchenComponent;
  let fixture: ComponentFixture<CfKitchenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfKitchenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CfKitchenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
