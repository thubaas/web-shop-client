import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartItemModel } from './cart-item/cart-item.model';
import { CartModel } from './cart.model';
import { CartService } from './cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
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
    this.cartItems = this.cartService.getCartItems();
    this.totalCost = this.cartService.getCart().totalCost;
    this.canOrder = this.totalCost > 0;
  }

  order() {
    console.log('Checkout : ', this.cartItems);
    // let checkoutItems: CheckoutItemModel[] = this.cartItems.map(
    //   (item) =>
    //     new CheckoutItemModel(
    //       item.product.id!,
    //       item.product.name,
    //       item.product.price,
    //       item.quantity
    //     )
    // );
    // this.http
    //   .post<{ sessionId: string }>(
    //     `${environment.baseUrl}/orders/create-checkout-session`,
    //     checkoutItems
    //   )
    //   .subscribe({
    //     next: (resData) => {
    //       console.log(resData);
    //       localStorage.setItem('sessionId', resData.sessionId);
    //     },
    //     error: (errRes) => console.log(errRes),
    //     complete: this.makePayment,
    //   });
  }

  makePayment() {
    // const paymentHandler = (<any>window).StripeCheckout.configure({
    //   key: environment.pk_test,
    //   locale: 'auto',
    //   token: function (stripeToken: any) {
    //     console.log(stripeToken);
    //     alert('Stripe token generated');
    //   },
    // });
    // paymentHandler.open({
    //   name: 'Your Payment',
    //   description: 'Your parcels',
    //   amount: this.totalCost * 100,
    // });
  }

  invokeStripe() {
    // if (!window.document.getElementById('stripe-script')) {
    //   const script = window.document.createElement('script');
    //   script.id = 'stripe-script';
    //   script.type = 'text/javascript';
    //   script.src = 'https://checkout.stripe.com/checkout.js';
    //   script.onload = () => {
    //     this.paymentHandler = (<any>window).StripeCheckout.configure({
    //       key: environment.pk_test,
    //       locale: 'auto',
    //       token: function (stripeToken: any) {
    //         console.log(stripeToken);
    //         alert('Payment Successfull');
    //       },
    //     });
    //   };
    //   window.document.body.appendChild(script);
    // }
  }
}
