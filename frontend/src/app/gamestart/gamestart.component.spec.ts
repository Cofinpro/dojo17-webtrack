import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamestartComponent } from './gamestart.component';

describe('GamestartComponent', () => {
  let component: GamestartComponent;
  let fixture: ComponentFixture<GamestartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamestartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamestartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
