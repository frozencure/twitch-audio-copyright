import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmVideosComponent } from './confirm-videos.component';

describe('ConfirmVideosComponent', () => {
  let component: ConfirmVideosComponent;
  let fixture: ComponentFixture<ConfirmVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmVideosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
