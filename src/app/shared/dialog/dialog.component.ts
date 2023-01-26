import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {

  @Input() message: string;
  @Input() iconClass: string;
  @Output() close = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

  onConfirm() {
    this.confirm.emit();
  }

  onClose() {
    this.close.emit();
  }

}
