import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.css'],
})
export class LoadingSpinnerComponent implements OnInit {
  @Output() loadingFinished = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  onFinishLoading() {
    this.loadingFinished.emit();
  }
}
