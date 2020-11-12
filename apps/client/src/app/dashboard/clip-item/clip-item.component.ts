import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-clip-item',
  templateUrl: './clip-item.component.html',
  styleUrls: [ './clip-item.component.scss' ]
})
export class ClipItemComponent implements OnInit {
  @Input() clip: any;

  constructor() {
  }

  ngOnInit(): void {
  }

}
