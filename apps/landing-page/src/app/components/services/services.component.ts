import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: [ './services.component.scss' ]
})
export class ServicesComponent implements OnInit {

  public cards = [ {
    title: 'Title',
    subTitle: 'SubTitle',
    image:'',
    content: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.'
  },
    {
      title: 'Title',
      subTitle: 'SubTitle',
      image:'',
      content: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.'
    },
    {
      title: 'Title',
      subTitle: 'SubTitle',
      image:'',
      content: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.'
    },
    {
      title: 'Title',
      subTitle: 'SubTitle',
      image:'',
      content: 'Some quick example text to build on the card title and make up the bulk of the card\'s content.'
    }];

  public bigCards = [
    {title:'Title',
    content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt congue ligula in rutrum. Morbi nec lacus condimentum, hendrerit mi eu, feugiat.',
    image:''},
    {title:'Title',
      content:'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tincidunt congue ligula in rutrum. Morbi nec lacus condimentum, hendrerit mi eu, feugiat.',
      image:''}
  ]

  constructor() {
  }

  ngOnInit(): void {
  }

}
