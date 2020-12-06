import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClipContainerComponent } from './clip-container.component';

describe('ClipContainerComponent', () => {
  let component: ClipContainerComponent;
  let fixture: ComponentFixture<ClipContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClipContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClipContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
