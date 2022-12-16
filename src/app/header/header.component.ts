import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { UserModel } from '../auth/user.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  show: boolean = false;
  user: string = 'guest';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.user.subscribe({
      next: (authData) => (this.user = authData?.username || 'guest'),
    });
  }
}
