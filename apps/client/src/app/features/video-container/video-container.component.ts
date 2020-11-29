import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Video } from '../../shared/model/Video';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-video-container',
  templateUrl: './video-container.component.html',
  styleUrls: ['./video-container.component.scss']
})
export class VideoContainerComponent implements OnInit {
  public videos$: Observable<Video[]>;
  public type: string;

  public firstFormGroup: FormGroup;
  public secondFormGroup: FormGroup;

  constructor(private actRoute: ActivatedRoute, private _formBuilder: FormBuilder) {
  }

  ngOnInit(): void {
    this.actRoute.data.subscribe(data => {
      this.type = data.routeResolver.type;
      this.videos$ = data.routeResolver.stream;
    }, err => console.log(err));

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }
}
