import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AlertComponent } from '../shared/alert/alert.component';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { PlaceholderDirective } from '../shared/placeholder.directive';
import { CartItemModel } from './cart-item/cart-item.model';
import { CartModel } from './cart.model';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  paymentHandler: any = null;
  cartItems: CartItemModel[] = [];
  totalCost: number = 0;
  cartObservable: Observable<CartModel>;
  totalCostObservable: Observable<number>;
  orderObservable: Observable<string>;
  loading: boolean = false;
  

  @ViewChild(PlaceholderDirective) dialogHost: PlaceholderDirective;
  private closeSubscription: Subscription;
  private confirmSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
  
    this.invokeStripe();
    this.cartItems = this.cartService.getCartItems();
    this.totalCost = this.cartService.getTotalCost();
   
    this.cartService.cartChanged.subscribe({
      next: () => {
        this.cartItems = this.cartService.getCartItems();
      },
    });

    this.cartService.totalCostChanged.subscribe({
      next: () => {
        this.totalCost = this.cartService.getTotalCost();
      },
    });
  }

  checkout() {
    this.popDialog(
      'Are you sure you want to proceed to checkout?',
      'bi bi-question-circle'
    );
  }

  order() {
    this.orderObservable = this.cartService.checkout(this.cartItems);
    this.orderObservable.subscribe({
      next: (resData) => {
        console.log(resData);
        localStorage.setItem('sessionId', resData);
      },
      error: (errRes) => console.log(errRes),
      complete: () => {
        const paymentHandler = (<any>window).StripeCheckout.configure({
          key: environment.pk_test,
          locale: 'auto',
          token: (stripeToken: any) => {
            console.log(stripeToken);
            this.showAlert('Payment Sucessful');
          },
        });

        this.loading = false;

        paymentHandler.open({
          name: 'Web-Shop Payment',
          description: 'Payment for your grocery',
          amount: this.totalCost * 100,
        });
      },
    });
  }

  makePayment() {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: environment.pk_test,
      locale: 'auto',
      token: (stripeToken: any) => {
        console.log(stripeToken);
      },
    });
    paymentHandler.open({
      name: 'Web-Shop Payment',
      description: 'Payment for your grocery',
      amount: this.totalCost * 100,
    });
  }

  invokeStripe() {
    if (!window.document.getElementById('stripe-script')) {
      const script = window.document.createElement('script');
      script.id = 'stripe-script';
      script.type = 'text/javascript';
      script.src = 'https://checkout.stripe.com/checkout.js';
      script.onload = () => {
        this.paymentHandler = (<any>window).StripeCheckout.configure({
          key: environment.pk_test,
          locale: 'auto',
          token: function (stripeToken: any) {
            console.log(stripeToken);
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }

  private popDialog(message: string, bsIconClass: string) {
    const hostViewContainerRef = this.dialogHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(DialogComponent);

    componentRef.instance.message = message;
    componentRef.instance.iconClass = bsIconClass;

    this.confirmSubscription = componentRef.instance.confirm.subscribe(() => {
      hostViewContainerRef.clear();
      console.log('Dialog on Confirm');
      this.loading = true;
      this.order();
    });

    this.closeSubscription = componentRef.instance.close.subscribe(() => {
      hostViewContainerRef.clear();
    });
  }

  private showAlert(
    message: string,
    bsIconClass: string = 'bi bi-check-circle'
  ) {
    const hostViewContainerRef = this.dialogHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(AlertComponent);

    componentRef.instance.message = message;
    componentRef.instance.iconClass = bsIconClass;
    this.closeSubscription = componentRef.instance.close.subscribe(() => {
      this.closeSubscription.unsubscribe();
      hostViewContainerRef.clear();
      this.cartService.setCartItems([]);
      this.cartService.setTotalCost(0);
      this.router.navigate(['/'], {
        relativeTo: this.route.root,
      });
    });
  }
}


