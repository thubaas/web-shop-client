import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'web-shop-client';
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.autoSignin();
  }

  onShowMenu() {
    let openBtn = document.getElementById('icon-menu');
    let closeBtn = document.getElementById('icon-close');
    let sidebarNavs = document.getElementById('sidebar-navs');

    openBtn?.classList.add('menu-btn-hide');
    openBtn?.classList.remove('menu-btn-show');

    closeBtn?.classList.add('close-btn-show');
    closeBtn?.classList.remove('close-btn-hide');

    sidebarNavs?.classList.remove('navs-hide');
    sidebarNavs?.classList.add('navs-show');
  }

  onHideMenu() {
    let openBtn = document.getElementById('icon-menu');
    let closeBtn = document.getElementById('icon-close');
    let sidebarNavs = document.getElementById('sidebar-navs');

    openBtn?.classList.remove('menu-btn-hide');
    openBtn?.classList.add('menu-btn-show');

    closeBtn?.classList.remove('close-btn-show');
    closeBtn?.classList.add('close-btn-hide');

    sidebarNavs?.classList.add('navs-hide');
    sidebarNavs?.classList.remove('navs-show');
  }
}
