import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoResultsComponent } from './video-results.component';

describe('VideoResultsComponent', () => {
  let component: VideoResultsComponent;
  let fixture: ComponentFixture<VideoResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoResultsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
