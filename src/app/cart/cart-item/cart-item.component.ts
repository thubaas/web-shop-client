import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { PlaceholderDirective } from 'src/app/shared/placeholder.directive';
import { CartModel } from '../cart.model';
import { CartService } from '../cart.service';
import { CartItemModel } from './cart-item.model';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.css'],
})
export class CartItemComponent implements OnInit, OnDestroy {
  @Input() cartItem: CartItemModel;
  @Input() index: number;
  loading: boolean = false;
  @ViewChild(PlaceholderDirective) alertHost: PlaceholderDirective;
  private closeSubscription: Subscription;
  private cartObservable: Observable<CartModel>;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {}

  onRemoveFromCart() {
    this.loading = true;
    this.cartObservable = this.cartService.removeFromCart(
      this.index,
      this.cartItem
    );
    this.cartObservable.subscribe({
      next: (resData) => this.onSuccess(resData),
      error: (errRes) => this.onError(errRes),
    });
  }

  onSuccess(resData: any) {
    this.loading = false;
    console.log(resData);
    this.showAlert(
      'Item removed successfully',
      'bi bi-check-circle text-success'
    );
  }

  onError(errorMessage: string) {
    this.loading = false;
    this.showAlert(errorMessage, 'bi bi-exclamation-circle text-danger');
  }

  private showAlert(
    message: string,
    bsIconClass: string = 'bi bi-check-circle'
  ) {
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(AlertComponent);

    componentRef.instance.message = message;
    componentRef.instance.iconClass = bsIconClass;
    this.closeSubscription = componentRef.instance.close.subscribe(() => {
      this.closeSubscription.unsubscribe();
      hostViewContainerRef.clear();
    });
  }

  ngOnDestroy(): void {
    if (this.closeSubscription) {
      this.closeSubscription.unsubscribe();
    }
  }
}
