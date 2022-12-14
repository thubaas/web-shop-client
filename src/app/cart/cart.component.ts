import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
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
  canOrder: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.invokeStripe();
    this.cartItems = this.cartService.getCartItems();
    this.totalCost = this.cartService.getCart().totalCost;
    this.canOrder = this.totalCost > 0;
  }

  order() {  
    this.makePayment();
    this.http
      .post<{ sessionId: string }>(
        `${environment.baseUrl}/orders/create-checkout-session`, //needs update
        this.cartItems
      )
      .subscribe({
        next: (resData) => {
          console.log(resData);
          localStorage.setItem('sessionId', resData.sessionId);
        },
        error: (errRes) => console.log(errRes),
        complete: this.makePayment,
      });
  }

  makePayment() {
    const paymentHandler = (<any>window).StripeCheckout.configure({
      key: environment.pk_test,
      locale: 'auto',
      token: function (stripeToken: any) {
        console.log(stripeToken);
        alert('Stripe token generated');
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
            alert('Payment Successfull');
          },
        });
      };
      window.document.body.appendChild(script);
    }
  }
}
