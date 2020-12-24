import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoResultsDetailComponent } from './video-results-detail.component';

describe('VideoResultsDetailComponent', () => {
  let component: VideoResultsDetailComponent;
  let fixture: ComponentFixture<VideoResultsDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoResultsDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoResultsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
