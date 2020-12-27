import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLiveCardComponent } from './home-live-card.component';

describe('HomeLiveCardComponent', () => {
  let component: HomeLiveCardComponent;
  let fixture: ComponentFixture<HomeLiveCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeLiveCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeLiveCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
