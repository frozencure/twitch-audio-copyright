import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ClipDto, ProcessingProgress, UserActionType, VideoDto } from '@twitch-audio-copyright/data';
import { Observable } from 'rxjs';
import { DashboardItemType } from '../../shared/model/dashboard-item-type';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home-summary-card',
  templateUrl: './home-summary-card.component.html',
  styleUrls: ['./home-summary-card.component.scss']
})
export class HomeSummaryCardComponent implements OnInit {

  @Input() items$: Observable<VideoDto[] | ClipDto[]>;
  @Input() type: DashboardItemType;

  @Output() refreshEventEmitter = new EventEmitter<DashboardItemType>();

  analyzedItems = new Array<VideoDto | ClipDto>();
  itemsInQueue = new Array<VideoDto | ClipDto>();
  needActionsItems = new Array<VideoDto | ClipDto>();

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.items$.subscribe((items: Array<VideoDto | ClipDto>) => {
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
