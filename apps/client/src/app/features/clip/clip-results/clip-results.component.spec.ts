import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClipResultsComponent } from './clip-results.component';

describe('ClipResultsComponent', () => {
  let component: ClipResultsComponent;
  let fixture: ComponentFixture<ClipResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClipResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClipResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
