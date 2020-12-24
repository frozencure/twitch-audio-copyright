import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoResultTimelineComponent } from './video-result-timeline.component';

describe('VideoResultTimelineComponent', () => {
  let component: VideoResultTimelineComponent;
  let fixture: ComponentFixture<VideoResultTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoResultTimelineComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoResultTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
