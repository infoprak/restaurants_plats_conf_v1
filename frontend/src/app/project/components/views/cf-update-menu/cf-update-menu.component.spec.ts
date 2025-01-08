import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CfUpdateMenuComponent } from './cf-update-menu.component';

describe('CfUpdateMenuComponent', () => {
  let component: CfUpdateMenuComponent;
  let fixture: ComponentFixture<CfUpdateMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CfUpdateMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CfUpdateMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
