
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  show:boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

 onShowMenu() {
  let openBtn = document.getElementById('icon-menu');
  let closeBtn = document.getElementById('icon-close');
  let sidebarNavs = document.getElementById('sidebar-navs');
  openBtn?.classList.add('item-hide')
  closeBtn?.classList.remove('item-hide')
  sidebarNavs?.classList.remove('item-hide')
}

onHideMenu() {
 let openBtn = document.getElementById('icon-menu');
 let closeBtn = document.getElementById('icon-close');
 let sidebarNavs = document.getElementById('sidebar-navs');
 openBtn?.classList.remove('item-hide')
 closeBtn?.classList.add('item-hide')
 sidebarNavs?.classList.add('item-hide')
}

}
