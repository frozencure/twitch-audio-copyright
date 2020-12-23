import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DownloadDialogData } from './download-dialog-data';
import { videoThumbnailUrl } from '../../utils/video.manager';


@Component({
  selector: 'app-download-dialog',
  templateUrl: './download-dialog.component.html',
  styleUrls: ['./download-dialog.component.scss']
})
export class DownloadDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DownloadDialogData) { }

  public getThumbnailUrl = videoThumbnailUrl;

  ngOnInit(): void {
  }



}
