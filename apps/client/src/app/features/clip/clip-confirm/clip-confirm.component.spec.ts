import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClipConfirmComponent } from './clip-confirm.component';

describe('ClipConfirmComponent', () => {
  let component: ClipConfirmComponent;
  let fixture: ComponentFixture<ClipConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClipConfirmComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClipConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
