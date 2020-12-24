import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClipTableComponent } from './clip-table.component';

describe('ClipTableComponent', () => {
  let component: ClipTableComponent;
  let fixture: ComponentFixture<ClipTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClipTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClipTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
