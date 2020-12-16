import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Clip, ProcessingProgress, UserActionType, Video } from '@twitch-audio-copyright/data';
import { Observable } from 'rxjs';
import { DashboardItemType } from '../../shared/model/dashboard-item-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-summary-card',
  templateUrl: './home-summary-card.component.html',
  styleUrls: ['./home-summary-card.component.scss']
})
export class HomeSummaryCardComponent implements OnInit {

  @Input() items$: Observable<Video[] | Clip[]>;
  @Input() type: DashboardItemType;

  @Output() refreshEventEmitter = new EventEmitter<DashboardItemType>();

  analyzedItems = new Array<Video | Clip>();
  itemsInQueue = new Array<Video | Clip>();
  needActionsItems = new Array<Video | Clip>();

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.items$.subscribe((items: Array<Video | Clip>) => {
      this.analyzedItems = items.filter(item => item.progress === ProcessingProgress.COMPLETED);
      this.itemsInQueue = items.filter(item => item.progress === ProcessingProgress.QUEUED);
      this.needActionsItems = items.filter(item => item.userAction === UserActionType.NEEDS_ACTION);
    });
  }

  typeAsString(): string {
    switch (this.type) {
      case DashboardItemType.CLIP:
        return 'clips';
      case DashboardItemType.VIDEO:
        return 'videos';
    }
  }

  onRefresh(): void {
    this.refreshEventEmitter.emit(this.type);
  }

  onAnalyzeMore() {
    switch (this.type) {
      case DashboardItemType.CLIP:
        this.router.navigate(['dashboard', 'clips']).catch(
          e => console.log(e)
        );
        break;
      case DashboardItemType.VIDEO:
        this.router.navigate(['dashboard', 'videos']).catch(
          e => console.log(e)
        );
        break;
    }
  }
}
