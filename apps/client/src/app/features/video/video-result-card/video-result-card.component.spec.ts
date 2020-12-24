import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoResultCardComponent } from './video-result-card.component';

describe('VideoResultCardComponent', () => {
  let component: VideoResultCardComponent;
  let fixture: ComponentFixture<VideoResultCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoResultCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoResultCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
