import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimepickerNumpadComponent } from './timepicker-numpad.component';

describe('TimepickerNumpadComponent', () => {
  let component: TimepickerNumpadComponent;
  let fixture: ComponentFixture<TimepickerNumpadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimepickerNumpadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimepickerNumpadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
