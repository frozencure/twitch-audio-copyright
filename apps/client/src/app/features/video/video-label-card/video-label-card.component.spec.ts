import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoLabelCardComponent } from './video-label-card.component';

describe('VideoLabelCardComponent', () => {
  let component: VideoLabelCardComponent;
  let fixture: ComponentFixture<VideoLabelCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoLabelCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoLabelCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
