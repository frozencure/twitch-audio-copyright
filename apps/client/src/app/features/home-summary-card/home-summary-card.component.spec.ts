import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSummaryCardComponent } from './home-summary-card.component';

describe('HomeSummaryCardComponent', () => {
  let component: HomeSummaryCardComponent;
  let fixture: ComponentFixture<HomeSummaryCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomeSummaryCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
