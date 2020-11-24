import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../core/authentication/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Input() drawer;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  public onLogout() {
    this.auth.logout().subscribe();
  }

}
