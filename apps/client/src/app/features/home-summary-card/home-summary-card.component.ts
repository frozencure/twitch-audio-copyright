import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Clip, ProcessingProgress, UserActionType, Video } from '@twitch-audio-copyright/data';
import { Observable, Subscription } from 'rxjs';
import { DashboardItemType } from '../../shared/model/dashboard-item-type';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-home-summary-card',
  templateUrl: './home-summary-card.component.html',
  styleUrls: ['./home-summary-card.component.scss']
})
export class HomeSummaryCardComponent implements OnInit, OnDestroy {

  @Input() items$: Observable<Video[] | Clip[]>;
  @Input() type: DashboardItemType;

  @Output() refreshEventEmitter = new EventEmitter<DashboardItemType>();

  analyzedItems: Array<Video | Clip>;
  itemsInQueue: Array<Video | Clip>;
  needActionsItems: Array<Video | Clip>;
  isLoading = false;

  itemsSubscription: Subscription;

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.itemsSubscription = this.items$.pipe(
      tap(() => this.isLoading = false)
    ).subscribe((items: Array<Video | Clip>) => {
      this.analyzedItems = items.filter(item => item.progress === ProcessingProgress.COMPLETED);
      this.itemsInQueue = items.filter(item => item.progress === ProcessingProgress.QUEUED);
      this.needActionsItems = items.filter(item => item.userAction === UserActionType.NEEDS_ACTION);
    });
  }

  ngOnDestroy() {
    this.itemsSubscription.unsubscribe();
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
    this.isLoading = true;
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
